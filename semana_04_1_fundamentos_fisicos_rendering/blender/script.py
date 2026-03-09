import bpy
import math

# ── Clean the scene ──────────────────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ── Render settings ──────────────────────────────────────────────────────────
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080

# Dark background to make the spheres stand out
world = bpy.context.scene.world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs["Color"].default_value = (0.03, 0.03, 0.05, 1.0)
    bg.inputs["Strength"].default_value = 1.5

# ── Material definitions ─────────────────────────────────────────────────────
# Each tuple: (name, base_color_RGBA, metallic, roughness)
# The first four are metals (metallic = 1.0), the rest are dielectrics (metallic = 0.0).
materials = [
    ("Iron",     (0.77, 0.78, 0.78, 1.0), 1.0, 0.60),
    ("Gold",     (1.00, 0.77, 0.33, 1.0), 1.0, 0.10),
    ("Copper",   (0.95, 0.64, 0.54, 1.0), 1.0, 0.20),
    ("Aluminum", (0.91, 0.92, 0.92, 1.0), 1.0, 0.05),
    ("Plastic",  (0.90, 0.10, 0.10, 1.0), 0.0, 0.50),
    ("Wood",     (0.60, 0.40, 0.20, 1.0), 0.0, 0.85),
    ("Marble",   (0.90, 0.90, 0.88, 1.0), 0.0, 0.15),
    ("Rubber",   (0.05, 0.05, 0.05, 1.0), 0.0, 0.95),
]

# Sweep metallic from 0 to 1 in 6 steps (fixed roughness)
grid_metallic = [
    (f"GM_{i}", (0.95, 0.85, 0.50, 1.0), i / 5.0, 0.3)
    for i in range(6)
]

# Sweep roughness from 0 to 1 in 6 steps (fixed metallic = 0)
grid_roughness = [
    (f"GR_{i}", (0.20, 0.40, 0.90, 1.0), 0.0, i / 5.0)
    for i in range(6)
]


# ── Helper functions ─────────────────────────────────────────────────────────

def create_material(name, color, metallic, roughness):
    """Create a Principled BSDF material with the given PBR parameters."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (0, 0)
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    out = nodes.new("ShaderNodeOutputMaterial")
    out.location = (300, 0)
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def create_sphere(name, pos, mat):
    """Add a smooth-shaded UV sphere and assign the given material."""
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.9, location=pos, segments=64, ring_count=32
    )
    obj = bpy.context.active_object
    obj.name = name
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(mat)
    return obj


# ── Place spheres in three rows ──────────────────────────────────────────────
spacing = 2.2

# Bottom row — canonical real-world materials
n = len(materials)
for i, (name, color, metallic, roughness) in enumerate(materials):
    x = -(n - 1) * spacing / 2.0 + i * spacing
    create_sphere(name, (x, 0, -3.0), create_material(name, color, metallic, roughness))

# Middle row — roughness gradient
n = len(grid_roughness)
for i, (name, color, metallic, roughness) in enumerate(grid_roughness):
    x = -(n - 1) * spacing / 2.0 + i * spacing
    create_sphere(name, (x, 0, 0.0), create_material(name, color, metallic, roughness))

# Top row — metallic gradient
n = len(grid_metallic)
for i, (name, color, metallic, roughness) in enumerate(grid_metallic):
    x = -(n - 1) * spacing / 2.0 + i * spacing
    create_sphere(name, (x, 0, 3.0), create_material(name, color, metallic, roughness))

# ── Ground plane ─────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -4.0))
floor = bpy.context.active_object
floor.name = "Floor"
floor.data.materials.append(create_material("Floor", (0.05, 0.05, 0.07, 1.0), 0.0, 0.8))

# ── Three-point lighting + ambient sun ───────────────────────────────────────

# Key light — main warm illumination from upper-right
bpy.ops.object.light_add(type='AREA', location=(6, -8, 8))
key = bpy.context.active_object
key.name = "KeyLight"
key.data.energy = 2000
key.data.size = 4
key.data.color = (1.0, 0.95, 0.88)
key.rotation_euler = (math.radians(45), math.radians(20), math.radians(30))

# Fill light — softer cool light from the left to reduce harsh shadows
bpy.ops.object.light_add(type='AREA', location=(-8, -4, 4))
fill = bpy.context.active_object
fill.name = "FillLight"
fill.data.energy = 600
fill.data.size = 6
fill.data.color = (0.78, 0.88, 1.0)
fill.rotation_euler = (math.radians(30), math.radians(-30), 0)

# Rim light — back light for edge separation
bpy.ops.object.light_add(type='AREA', location=(0, 10, 5))
rim = bpy.context.active_object
rim.name = "RimLight"
rim.data.energy = 800
rim.data.size = 8
rim.data.color = (0.9, 0.95, 1.0)
rim.rotation_euler = (math.radians(-40), 0, 0)

# Ambient sun — low-energy directional light for subtle overall fill
bpy.ops.object.light_add(type='SUN', location=(0, 0, 20))
sun = bpy.context.active_object
sun.name = "AmbientSun"
sun.data.energy = 2
sun.data.color = (0.8, 0.85, 1.0)
sun.rotation_euler = (math.radians(60), 0, math.radians(45))

# ── Camera ───────────────────────────────────────────────────────────────────
bpy.ops.object.camera_add(location=(0, -22, 1))
cam = bpy.context.active_object
cam.name = "MainCamera"
cam.rotation_euler = (math.radians(88), 0, 0)
cam.data.lens = 40
scene.camera = cam

# ── Turntable animation ─────────────────────────────────────────────────────
# Parent every object (except the camera and the pivot itself) to an empty
# so the whole scene rotates 360° over 240 frames (10 s at 24 fps).
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
pivot = bpy.context.active_object
pivot.name = "ScenePivot"

for obj in bpy.data.objects:
    if obj.name in ["MainCamera", "ScenePivot"]:
        continue
    obj.parent = pivot

scene.frame_start = 1
scene.frame_end = 240
scene.render.fps = 24

scene.frame_set(1)
pivot.rotation_euler = (0, 0, 0)
pivot.keyframe_insert(data_path="rotation_euler", index=2)

scene.frame_set(240)
pivot.rotation_euler = (0, 0, math.radians(360))
pivot.keyframe_insert(data_path="rotation_euler", index=2)
