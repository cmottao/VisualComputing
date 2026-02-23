using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class TransformController : MonoBehaviour
{
    [Header("Target Object (Parent)")]
    public Transform targetObject;

    [Header("Position Sliders")]
    public Slider sliderPosX;
    public Slider sliderPosY;
    public Slider sliderPosZ;

    [Header("Rotation Sliders")]
    public Slider sliderRotX;
    public Slider sliderRotY;
    public Slider sliderRotZ;

    [Header("Scale Sliders")]
    public Slider sliderScaleX;
    public Slider sliderScaleY;
    public Slider sliderScaleZ;

    [Header("Info Display")]
    public TextMeshProUGUI transformInfoText;

    void Start()
    {
        // Initialize sliders with current values
        if (targetObject != null)
        {
            sliderPosX.value = targetObject.localPosition.x;
            sliderPosY.value = targetObject.localPosition.y;
            sliderPosZ.value = targetObject.localPosition.z;

            sliderRotX.value = targetObject.localEulerAngles.x;
            sliderRotY.value = targetObject.localEulerAngles.y;
            sliderRotZ.value = targetObject.localEulerAngles.z;

            sliderScaleX.value = targetObject.localScale.x;
            sliderScaleY.value = targetObject.localScale.y;
            sliderScaleZ.value = targetObject.localScale.z;
        }

        // Add listeners
        sliderPosX.onValueChanged.AddListener(delegate { UpdateTransform(); });
        sliderPosY.onValueChanged.AddListener(delegate { UpdateTransform(); });
        sliderPosZ.onValueChanged.AddListener(delegate { UpdateTransform(); });

        sliderRotX.onValueChanged.AddListener(delegate { UpdateTransform(); });
        sliderRotY.onValueChanged.AddListener(delegate { UpdateTransform(); });
        sliderRotZ.onValueChanged.AddListener(delegate { UpdateTransform(); });

        sliderScaleX.onValueChanged.AddListener(delegate { UpdateTransform(); });
        sliderScaleY.onValueChanged.AddListener(delegate { UpdateTransform(); });
        sliderScaleZ.onValueChanged.AddListener(delegate { UpdateTransform(); });
    }

    void UpdateTransform()
    {
        if (targetObject == null) return;

        // Apply position
        targetObject.localPosition = new Vector3(
            sliderPosX.value,
            sliderPosY.value,
            sliderPosZ.value
        );

        // Apply rotation
        targetObject.localEulerAngles = new Vector3(
            sliderRotX.value,
            sliderRotY.value,
            sliderRotZ.value
        );

        // Apply scale
        targetObject.localScale = new Vector3(
            sliderScaleX.value,
            sliderScaleY.value,
            sliderScaleZ.value
        );

        // Update UI text and console
        UpdateInfoDisplay();
    }

    void UpdateInfoDisplay()
    {
        string info = "=== PARENT ===\n";
        info += FormatTransform(targetObject);

        // Show child transforms to demonstrate inheritance
        foreach (Transform child in targetObject)
        {
            info += $"\n=== CHILD: {child.name} ===\n";
            info += FormatTransform(child);

            foreach (Transform grandchild in child)
            {
                info += $"\n=== GRANDCHILD: {grandchild.name} ===\n";
                info += FormatTransform(grandchild);
            }
        }

        if (transformInfoText != null)
            transformInfoText.text = info;

        Debug.Log(info);
    }

    string FormatTransform(Transform t)
    {
        string s = "";
        s += $"Local Pos: ({t.localPosition.x:F2}, {t.localPosition.y:F2}, {t.localPosition.z:F2})\n";
        s += $"World Pos: ({t.position.x:F2}, {t.position.y:F2}, {t.position.z:F2})\n";
        s += $"Local Rot: ({t.localEulerAngles.x:F2}, {t.localEulerAngles.y:F2}, {t.localEulerAngles.z:F2})\n";
        s += $"World Rot: ({t.eulerAngles.x:F2}, {t.eulerAngles.y:F2}, {t.eulerAngles.z:F2})\n";
        s += $"Local Scale: ({t.localScale.x:F2}, {t.localScale.y:F2}, {t.localScale.z:F2})\n";
        s += $"Lossy Scale: ({t.lossyScale.x:F2}, {t.lossyScale.y:F2}, {t.lossyScale.z:F2})\n";
        return s;
    }
}