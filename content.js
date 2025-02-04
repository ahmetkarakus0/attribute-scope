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

class AttributeHighlighter {
  constructor() {
    this.isActive = false;
    this.attributeElements = [];
    this.originalStyles = new Map();
    this.activeTooltip = null;
    this.activeElement = null;
    this.observer = null;
    this.button = this.createToggleButton();
    this.javaSmartCopy = false;
    this.attributeName = "data-test-id";

    // Set initial visibility based on stored preference
    chrome.storage.sync.get(
      ["buttonVisible", "javaSmartCopy", "attributeName"],
      (result) => {
        this.button.style.display =
          result.buttonVisible !== false ? "inline-flex" : "none";
        this.javaSmartCopy = result.javaSmartCopy !== false;
        this.attributeName = result.attributeName || "data-test-id";
        this.button.textContent = `Show Elements with ${this.attributeName}`;
      }
    );

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "toggleButtonVisibility") {
        if (!message.visible) {
          this.resetHighlights();
          this.button.textContent = `Show Elements with ${this.attributeName}`;
          this.isActive = false;
        }

        this.button.style.display = message.visible ? "inline-flex" : "none";
      }

      if (message.action === "toggleJavaSmartCopy") {
        this.javaSmartCopy = message.enabled;
      }

      if (message.action === "updateAttributeName") {
        this.attributeName = message.attributeName;
        this.button.textContent = `Show Elements with ${this.attributeName}`;
        this.resetHighlights();
        if (this.isActive) {
          this.toggleHighlight();
          this.toggleHighlight();
        }
      }
    });

    this.init();
  }

  /**
   * Resets all highlights and clears the attributeElements array.
   */
  resetHighlights() {
    this.attributeElements.forEach((element) =>
      this.resetElementStyles(element)
    );
    this.attributeElements = [];
    this.originalStyles.clear();
  }

  /**
   * Creates a toggle button for the highlighter.
   * @returns {HTMLButtonElement} The toggle button.
   */
  createToggleButton() {
    const button = document.createElement("button");
    button.textContent = `Show Elements with ${this.attributeName}`;
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
    tooltip.className = "attribute-tooltip";
    tooltip.textContent = element.getAttribute(this.attributeName);

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
   * Format searched attribute value for java smart copy
   * @param {string} attributeValue - The searched attribute value to format.
   * @returns {string} The formatted searched attribute value.
   */
  formatAttributeValueForJavaSmartCopy(attributeValue) {
    if (!attributeValue) return "";

    const camelCaseId = attributeValue
      .split("-")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");

    return `private final By ${camelCaseId} = createXPath("${attributeValue}");`;
  }

  /**
   * Handles the key press event for the highlighter.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  handleKeyDown = (e) => {
    if (
      (e.metaKey || e.ctrlKey || e.shiftKey) &&
      e.key.toLowerCase() === "c" &&
      this.activeElement &&
      this.activeTooltip
    ) {
      e.preventDefault();
      e.stopPropagation();

      const attributeValue = this.activeElement.getAttribute(
        this.attributeName
      );

      let formattedAttributeValue = attributeValue;

      if (this.javaSmartCopy) {
        formattedAttributeValue =
          this.formatAttributeValueForJavaSmartCopy(attributeValue);
      }

      navigator.clipboard.writeText(formattedAttributeValue).then(() => {
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
            const newElements = [
              ...node.querySelectorAll(`[${this.attributeName}]`),
            ];
            if (node.hasAttribute(this.attributeName)) {
              newElements.push(node);
            }
            newElements.forEach((element) => {
              if (!this.attributeElements.includes(element)) {
                this.attributeElements.push(element);
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
      document.addEventListener("keydown", this.handleKeyDown);
      this.setupObserver();
      this.attributeElements = Array.from(
        document.querySelectorAll(`[${this.attributeName}]`)
      );
      this.attributeElements.forEach((element) =>
        this.setupElementHighlight(element)
      );
      this.button.textContent = `Hide Elements with ${this.attributeName}`;
    } else {
      this.attributeElements.forEach((element) =>
        this.resetElementStyles(element)
      );
      document.removeEventListener("keydown", this.handleKeyDown);
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.button.textContent = `Show Elements with ${this.attributeName}`;
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
new AttributeHighlighter();
