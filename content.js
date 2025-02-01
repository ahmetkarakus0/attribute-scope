/* Toggle Button Design - Start */
const findDataTestIdToggleButton = document.createElement("button");
findDataTestIdToggleButton.textContent = "Find Elements";

Object.assign(findDataTestIdToggleButton.style, {
  alignItems: "center",
  appearance: "none",
  backgroundColor: "#FCFCFD",
  borderRadius: "4px",
  borderWidth: "0",
  boxShadow:
    "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset",
  boxSizing: "border-box",
  color: "#36395A",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "JetBrains Mono,monospace",
  height: "48px",
  justifyContent: "center",
  lineHeight: "1",
  listStyle: "none",
  overflow: "hidden",
  paddingLeft: "16px",
  paddingRight: "16px",
  position: "fixed",
  bottom: "16px",
  right: "16px",
  textAlign: "left",
  textDecoration: "none",
  transition: "box-shadow .15s,transform .15s",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
  outline: "none",
  whiteSpace: "nowrap",
  willChange: "box-shadow,transform",
  fontSize: "18px",
  zIndex: "9999",
});

findDataTestIdToggleButton.addEventListener("mouseover", () => {
  findDataTestIdToggleButton.style.boxShadow =
    "rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset";
});

findDataTestIdToggleButton.addEventListener("mouseout", () => {
  findDataTestIdToggleButton.style.boxShadow =
    "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset";
});

findDataTestIdToggleButton.addEventListener("mousedown", () => {
  findDataTestIdToggleButton.style.boxShadow = "#D6D6E7 0 3px 7px inset";
  findDataTestIdToggleButton.style.transform = "translateY(2px)";
});

findDataTestIdToggleButton.addEventListener("mouseup", () => {
  findDataTestIdToggleButton.style.boxShadow =
    "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset";
  findDataTestIdToggleButton.style.transform = "none";
});

/* Toggle Button Design - End */

/* Toggle Button Logic - Start */
let isActive = false;
let dataTestIdElements = [];
let originalStyles = new Map();
let activeTooltip = null;

findDataTestIdToggleButton.addEventListener("click", () => {
  dataTestIdElements = document.querySelectorAll("[data-test-id]");
  if (isActive) {
    isActive = false;
    dataTestIdElements.forEach((element) => {
      const originalStyle = originalStyles.get(element);
      element.style.border = originalStyle.border;
      element.style.borderRadius = originalStyle.borderRadius;
      element.style.padding = originalStyle.padding;
      element.style.margin = originalStyle.margin;

      // Remove mouseover and mouseout event listeners
      element.onmouseover = null;
      element.onmouseout = null;
    });
  } else {
    isActive = true;
    dataTestIdElements.forEach((element) => {
      originalStyles.set(element, {
        border: element.style.border,
        borderRadius: element.style.borderRadius,
      });

      Object.assign(element.style, {
        border: "1px solid red",
        borderRadius: "8px",
      });

      // Güncellenmiş tooltip fonksiyonalitesi
      element.onmouseover = (e) => {
        e.stopPropagation();

        // Varsa önceki tooltip'i kaldır
        if (activeTooltip) {
          activeTooltip.remove();
        }

        const tooltip = document.createElement("div");
        tooltip.className = "data-test-id-tooltip";
        tooltip.textContent = element.getAttribute("data-test-id");

        Object.assign(tooltip.style, {
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: "10000",
          top: `${e.pageY + 10}px`,
          left: `${e.pageX + 10}px`,
        });

        document.body.appendChild(tooltip);
        element._tooltip = tooltip;
        activeTooltip = tooltip;
      };

      element.onmouseout = (e) => {
        e.stopPropagation();
        if (element._tooltip) {
          element._tooltip.remove();
          element._tooltip = null;
          activeTooltip = null;
        }
      };
    });
  }
});
/* Toggle Button Logic - End */

document.body.appendChild(findDataTestIdToggleButton);
