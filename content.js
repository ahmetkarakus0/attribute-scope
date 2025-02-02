const BUTTON_STYLES = {
  alignItems: "center",
  appearance: "none",
  backgroundColor: "#FCFCFD",
  borderRadius: "4px",
  borderWidth: "0",
  boxShadow:
    "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset",
  color: "#36395A",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "JetBrains Mono,monospace",
  height: "48px",
  justifyContent: "center",
  lineHeight: "1",
  listStyle: "none",
  overflow: "hidden",
  padding: "0 16px",
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
};

const TOOLTIP_STYLES = {
  position: "absolute",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "white",
  padding: "5px 10px",
  borderRadius: "4px",
  fontSize: "12px",
  zIndex: "10000",
};

const HIGHLIGHT_STYLES = {
  border: "2px solid red",
  borderRadius: "8px",
};

class DataTestIdHighlighter {
  constructor() {
    this.isActive = false;
    this.dataTestIdElements = [];
    this.originalStyles = new Map();
    this.activeTooltip = null;
    this.activeElement = null;
    this.observer = null;
    this.button = this.createToggleButton();

    // Set initial visibility based on stored preference
    chrome.storage.sync.get(["buttonVisible"], (result) => {
      this.button.style.display =
        result.buttonVisible !== false ? "inline-flex" : "none";
    });

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "toggleButtonVisibility") {
        this.button.style.display = message.visible ? "inline-flex" : "none";
      }
    });

    this.init();
  }

  /**
   * Creates a toggle button for the highlighter.
   * @returns {HTMLButtonElement} The toggle button.
   */
  createToggleButton() {
    const button = document.createElement("button");
    button.textContent = "Show Elements with Data Test Id";
    Object.assign(button.style, BUTTON_STYLES);
    this.setupButtonEvents(button);
    return button;
  }

  /**
   * Sets up event listeners for the toggle button.
   * @param {HTMLButtonElement} button - The toggle button.
   */
  setupButtonEvents(button) {
    button.addEventListener("mouseover", () => {
      button.style.boxShadow =
        "rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset";
    });

    button.addEventListener("mouseout", () => {
      button.style.boxShadow = BUTTON_STYLES.boxShadow;
    });

    button.addEventListener("mousedown", () => {
      button.style.boxShadow = "#D6D6E7 0 3px 7px inset";
      button.style.transform = "translateY(2px)";
    });

    button.addEventListener("mouseup", () => {
      button.style.boxShadow = BUTTON_STYLES.boxShadow;
      button.style.transform = "none";
    });

    button.addEventListener("click", () => this.toggleHighlight());
  }

  /**
   * Creates a tooltip for an element.
   * @param {HTMLElement} element - The element to create a tooltip for.
   * @param {MouseEvent} event - The mouse event.
   * @returns {HTMLDivElement} The tooltip.
   */
  createTooltip(element, event) {
    const tooltip = document.createElement("div");
    tooltip.className = "data-test-id-tooltip";
    tooltip.textContent = element.getAttribute("data-test-id");

    Object.assign(tooltip.style, {
      ...TOOLTIP_STYLES,
      top: `${event.pageY + 10}px`,
      left: `${event.pageX + 10}px`,
    });

    return tooltip;
  }

  /**
   * Handles the mouse over event for an element.
   * @param {HTMLElement} element - The element that was hovered over.
   * @param {MouseEvent} event - The mouse event.
   */
  handleElementMouseOver(element, event) {
    event.stopPropagation();
    this.activeElement = element;

    if (this.activeTooltip) {
      this.activeTooltip.remove();
    }

    const tooltip = this.createTooltip(element, event);
    document.body.appendChild(tooltip);
    element._tooltip = tooltip;
    this.activeTooltip = tooltip;
  }

  /**
   * Handles the mouse out event for an element.
   * @param {HTMLElement} element - The element that was hovered out of.
   * @param {MouseEvent} event - The mouse event.
   */
  handleElementMouseOut(element, event) {
    event.stopPropagation();
    this.activeElement = null;
    if (element._tooltip) {
      element._tooltip.remove();
      element._tooltip = null;
      this.activeTooltip = null;
    }
  }

  /**
   * Sets up the highlight for an element.
   * @param {HTMLElement} element - The element to highlight.
   */
  setupElementHighlight(element) {
    this.originalStyles.set(element, {
      border: element.style.border || "",
      borderRadius: element.style.borderRadius || "",
    });

    Object.assign(element.style, HIGHLIGHT_STYLES);

    element.onmouseover = (e) => this.handleElementMouseOver(element, e);
    element.onmouseout = (e) => this.handleElementMouseOut(element, e);
  }

  /**
   * Resets the styles of an element.
   * @param {HTMLElement} element - The element to reset.
   */
  resetElementStyles(element) {
    const originalStyle = this.originalStyles.get(element);
    if (originalStyle) {
      Object.entries(originalStyle).forEach(([prop, value]) => {
        if (value !== undefined) element.style[prop] = value;
      });
    } else {
      Object.keys(HIGHLIGHT_STYLES).forEach((prop) => {
        element.style[prop] = "";
      });
    }
    element.onmouseover = null;
    element.onmouseout = null;
  }

  /**
   * Handles the key press event for the highlighter.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  handleKeyPress = (e) => {
    if (
      e.key.toLowerCase() === "c" &&
      this.activeElement &&
      this.activeTooltip
    ) {
      e.stopPropagation();
      const dataTestId = this.activeElement.getAttribute("data-test-id");
      navigator.clipboard.writeText(dataTestId).then(() => {
        const originalText = this.activeTooltip.textContent;
        this.activeTooltip.textContent = "Copied!";
        setTimeout(() => {
          if (this.activeTooltip) {
            this.activeTooltip.textContent = originalText;
          }
        }, 1000);
      });
    }
  };

  /**
   * Sets up the observer for the highlighter.
   */
  setupObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const newElements = [...node.querySelectorAll("[data-test-id]")];
            if (node.hasAttribute("data-test-id")) {
              newElements.push(node);
            }
            newElements.forEach((element) => {
              if (!this.dataTestIdElements.includes(element)) {
                this.dataTestIdElements.push(element);
                this.setupElementHighlight(element);
              }
            });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Toggles the highlight on and off.
   */
  toggleHighlight() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      document.addEventListener("keyup", this.handleKeyPress);
      this.setupObserver();
      this.dataTestIdElements = Array.from(
        document.querySelectorAll("[data-test-id]")
      );
      this.dataTestIdElements.forEach((element) =>
        this.setupElementHighlight(element)
      );
      this.button.textContent = "Hide";
    } else {
      this.dataTestIdElements.forEach((element) =>
        this.resetElementStyles(element)
      );
      document.removeEventListener("keyup", this.handleKeyPress);
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.button.textContent = "Show Elements with Data Test Id";
    }
  }

  /**
   * Initializes the highlighter.
   */
  init() {
    document.body.appendChild(this.button);
  }
}

// Initialize the highlighter
new DataTestIdHighlighter();
