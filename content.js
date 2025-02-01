/* Toggle Button Design - Start */
const findDataTestIdToggleButton = document.createElement("button");
findDataTestIdToggleButton.textContent = "Show Elements with Data Test Id";

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
let activeElement = null;
let observer = null; // MutationObserver için değişken

findDataTestIdToggleButton.addEventListener("click", () => {
  if (isActive) {
    isActive = false;
    dataTestIdElements.forEach((element) => {
      const originalStyle = originalStyles.get(element);
      if (originalStyle) {
        // Orijinal stiller varsa geri yükle
        if (originalStyle.border !== undefined)
          element.style.border = originalStyle.border;
        if (originalStyle.borderRadius !== undefined)
          element.style.borderRadius = originalStyle.borderRadius;
        if (originalStyle.padding !== undefined)
          element.style.padding = originalStyle.padding;
        if (originalStyle.margin !== undefined)
          element.style.margin = originalStyle.margin;
      } else {
        // Orijinal stiller yoksa varsayılan değerlere döndür
        element.style.border = "";
        element.style.borderRadius = "";
        element.style.padding = "";
        element.style.margin = "";
      }

      // Remove mouseover and mouseout event listeners
      element.onmouseover = null;
      element.onmouseout = null;
    });
    document.removeEventListener("keyup", handleKeyPress);
    if (observer) {
      observer.disconnect(); // Observer'ı durdur
      observer = null;
    }
    findDataTestIdToggleButton.textContent = "Show Elements with Data Test Id";
  } else {
    isActive = true;
    document.addEventListener("keyup", handleKeyPress);

    // MutationObserver oluştur
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node kontrolü
            // Yeni eklenen element içindeki tüm data-test-id'li elementleri bul
            const newElements = node.querySelectorAll("[data-test-id]");
            if (node.hasAttribute("data-test-id")) {
              newElements.add(node);
            }

            newElements.forEach((element) => {
              if (!dataTestIdElements.includes(element)) {
                dataTestIdElements.push(element);
                // Yeni element için stilleri uygula
                originalStyles.set(element, {
                  border: element.style.border || "",
                  borderRadius: element.style.borderRadius || "",
                  padding: element.style.padding || "",
                  margin: element.style.margin || "",
                });

                Object.assign(element.style, {
                  border: "1px solid red",
                  borderRadius: "8px",
                });

                element.onmouseover = (e) => {
                  e.stopPropagation();
                  activeElement = element;

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
                  activeElement = null;
                  if (element._tooltip) {
                    element._tooltip.remove();
                    element._tooltip = null;
                    activeTooltip = null;
                  }
                };
              }
            });
          }
        });
      });
    });

    // Observer'ı başlat
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Mevcut elementleri işle
    dataTestIdElements = Array.from(
      document.querySelectorAll("[data-test-id]")
    );
    dataTestIdElements.forEach((element) => {
      // Mevcut stilleri kaydet
      originalStyles.set(element, {
        border: element.style.border || "",
        borderRadius: element.style.borderRadius || "",
        padding: element.style.padding || "",
        margin: element.style.margin || "",
      });

      Object.assign(element.style, {
        border: "1px solid red",
        borderRadius: "8px",
      });

      element.onmouseover = (e) => {
        e.stopPropagation();
        activeElement = element;

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
        activeElement = null;
        if (element._tooltip) {
          element._tooltip.remove();
          element._tooltip = null;
          activeTooltip = null;
        }
      };
    });

    findDataTestIdToggleButton.textContent = "Hide";
  }
});

function handleKeyPress(e) {
  if (e.key.toLowerCase() === "c" && activeElement && activeTooltip) {
    e.stopPropagation();
    const dataTestId = activeElement.getAttribute("data-test-id");
    navigator.clipboard.writeText(dataTestId).then(() => {
      const originalText = activeTooltip.textContent;
      activeTooltip.textContent = "Copied!";

      setTimeout(() => {
        if (activeTooltip) {
          activeTooltip.textContent = originalText;
        }
      }, 1000);
    });
  }
}
/* Toggle Button Logic - End */

document.body.appendChild(findDataTestIdToggleButton);
