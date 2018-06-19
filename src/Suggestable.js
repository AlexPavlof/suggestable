/* eslint-disable no-case-declarations */
// @flow

/**
 * Up Key code.
 *
 * @type {number}
 */
const KEY_UP = 38;

/**
 * Down rey code.
 *
 * @type {number}
 */
const KEY_DOWN = 40;

/**
 * Enter key code.
 *
 * @type {number}
 */
const KEY_ENTER = 13;

/**
 * Enter key code (numeric keyboard).
 *
 * @type {number}
 */
const KEY_NUMENTER = 108;

/**
 * Escape key code.
 *
 * @type {number}
 */
const KEY_ESCAPE = 27;

/**
 * Calculate outer height of given element with margins.
 *
 * @param  {HTMLElement} element
 * @return {number}
 */
export const outerHeight = (element: HTMLElement): number => {
    const style = getComputedStyle(element);
    let height  = parseInt(style.height, 10) || 0;

    height += (parseInt(style.paddingTop, 10) || 0) + (parseInt(style.paddingBottom, 10) || 0);
    height += (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
    height += (parseInt(style.borderTopWidth, 10) || 0) + (parseInt(style.borderBottomWidth, 10) || 0);

    return height;
};

export const isVisible = (element: HTMLElement): boolean =>
    !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);

export default class Suggestable {
    /**
     * Default options.
     *
     * @type {Object}
     */
    options: Object = {
        'data-url':          'suggestableUrl',
        'container-class':   'suggestable-container',
        'item-class':        'suggestable-item',
        'item-active-class': 'suggestable-item-active',
        'term-class':        'suggestable-term',
        'suggest-class':     'suggestable-suggest',
        'delimiter-text':    ' — ',
        'delimiter-class':   'suggestable-delimiter',
        'text-class':        'suggestable-text',
        'term-min-length':   3,
    };

    /**
     * Hovered element index.
     *
     * @type {number}
     */
    hoverIndex: number = -1;

    /**
     * Cache object.
     *
     * @type {Object}
     */
    cache: Object = {};

    /**
     * Selector for item with suggestion.
     *
     * @type {string}
     */
    itemSelector: string = '';

    /**
     * Input element.
     *
     * @type {HTMLInputElement}
     */
    inputElement: HTMLInputElement;

    /**
     * Main container element for suggestions.
     *
     * @type {HTMLElement}
     */
    containerElement: HTMLElement;

    /**
     * Term for suggestions search.
     *
     * @type {string}
     */
    term: string = '';

    /**
     * Url for suggestions request.
     *
     * @type {string}
     */
    url: string;

    /**
     * Constructor.
     *
     * @param {*}      element
     * @param {Object} options
     */
    constructor(element: HTMLInputElement, options: Object = {}): void {
        Object.assign(this.options, options);

        this.inputElement = element;
        this.containerElement = this.getContainer(this.inputElement);
        this.itemSelector = `.${this.options['item-class']}`;
        this.url = this.inputElement.dataset[this.options['data-url']];

        this.init();
    }

    /**
     * Initialization of main events.
     */
    init(): void {
        document.addEventListener('mouseup', this.handlerMouseUp.bind(this), false);
        (document.addEventListener: Function)(
            'suggestable-hide',
            this.handlerSuggestableHide.bind(this), false,
        );
        (document.addEventListener: Function)(
            'suggestable-show',
            this.handlerSuggestableShow.bind(this), false,
        );
        (document.addEventListener: Function)(
            'suggestable-item-select',
            this.handlerSuggestableItemSelect.bind(this), false,
        );
        (document.addEventListener: Function)(
            'suggestable-item-unselect',
            this.handlerSuggestableItemUnselect.bind(this), false,
        );

        this.inputElement.setAttribute('autocomplete', 'off');
        this.inputElement.addEventListener('keydown', this.handlerKeyDown.bind(this), false);
        this.inputElement.addEventListener('keyup', this.handlerKeyUp.bind(this), false);
    }

    /**
     * Returns container element.
     *
     * @param  {HTMLElement} element
     * @return {HTMLElement}
     */
    getContainer(element: HTMLElement): HTMLElement {
        const id: string                         = element.id || (`sb${Math.round(Math.random() * 9999)}${1}`);
        const containerId: string                = `${id}__container`;
        const selector: string                   = `#${containerId}`;
        let containerElement: HTMLElement | null = document.querySelector(selector);

        if (!containerElement) {
            containerElement = document.createElement('ul');

            containerElement.classList.add(this.options['container-class']);
            containerElement.id = containerId;
            containerElement.style.marginTop = `${outerHeight(element)}px`;
            containerElement.style.display = 'none';

            if (element.parentNode) {
                element.parentNode.insertBefore(containerElement, element.nextSibling);
            }
        }

        return containerElement;
    }

    /**
     * Returns all suggestions elements in DOM.
     *
     * @return {NodeList<HTMLElement>}
     */
    getItems(): NodeList<HTMLElement> {
        return this.containerElement.querySelectorAll(this.itemSelector);
    }

    /**
     * Returns cached suggestions values.
     *
     * @param  {string}             key
     * @return {Array<Object>|null}
     */
    getCachedValue(key: string): Array<Object> | null {
        if (!Object.prototype.hasOwnProperty.call(this.cache, key)) {
            return null;
        }

        return this.cache[key];
    }

    /**
     * Returns suggestions from remote API.
     *
     * @return {Promise<Array<Object>>}
     */
    fetchResults(): Promise<Array<Object>> {
        /**
         * Checks response status.
         *
         * @param  {Response}     response
         * @return {Promise<any>}
         */
        const status = (response: Response): Promise<Response> => {
            if (response.status < 200 || response.status >= 300) {
                return Promise.reject(new Error(response.statusText));
            }

            return Promise.resolve(response);
        };
        /**
         * Returns JSON data from response.
         *
         * @param  {Response}               response
         * @return {Promise<Array<Object>>}
         */
        const json = (response: Response): Promise<Array<Object>> => response.json();

        return fetch(`${this.url}?term=${encodeURIComponent(this.term)}`, {
            method: 'GET',
        }).then(status).then(json);
    }

    /**
     * Process results from remote API.
     *
     * @param {Array<Object>} items
     */
    processResults(items: Array<Object>): void {
        if (items.length === 0) {
            return;
        }

        this.cleanResults();

        items.forEach(this.createSuggestableItem.bind(this));

        document.dispatchEvent(new CustomEvent('suggestable-show'));
    }

    /**
     * Creates suggestion item and append it into DOM.
     *
     * @param {Object} item
     * @param {number} index
     */
    createSuggestableItem(item: Object, index: number): void {
        const itemElement: HTMLElement    = document.createElement('li');
        const termElement: HTMLElement    = document.createElement('span');
        const suggestElement: HTMLElement = document.createElement('span');

        itemElement.style.display = 'none';
        itemElement.classList.add(this.options['item-class']);

        termElement.classList.add(this.options['term-class']);
        termElement.textContent = this.term;

        suggestElement.classList.add(this.options['suggest-class']);
        suggestElement.textContent = item.query.substr(this.term.length);

        itemElement.appendChild(termElement);
        itemElement.appendChild(suggestElement);
        itemElement.dataset.suggestData = item.query;
        itemElement.dataset.suggestIndex = index.toString();
        itemElement.dataset.suggestUrl = item['suggest-url'];

        if (item['suggest-text'] !== '') {
            const delimiterElement: HTMLElement     = document.createElement('span');
            const delimiterTextElement: HTMLElement = document.createElement('span');

            delimiterElement.classList.add(this.options['delimiter-class']);
            delimiterTextElement.classList.add(this.options['text-class']);

            delimiterElement.textContent = this.options['delimiter-text'];
            delimiterTextElement.textContent = item['suggest-text'];

            itemElement.appendChild(delimiterElement);
            itemElement.appendChild(delimiterTextElement);
        }

        itemElement.style.display = 'block';

        itemElement.addEventListener('mouseover', this.handlerMouseOver.bind(this), false);
        itemElement.addEventListener('mouseout', this.handlerMouseOut.bind(this), false);
        itemElement.addEventListener('click', this.handlerClick.bind(this), false);

        this.containerElement.appendChild(itemElement);
    }

    /**
     * Removes suggestions results from DOM.
     */
    cleanResults(): void {
        Array.prototype.forEach.call(this.getItems(), (itemsElement: HTMLElement) => {
            itemsElement.remove();
        });
    }

    /**
     * Handles the event on mouse over suggestion in DOM.
     *
     * @param {MouseEvent} event
     */
    handlerMouseOver(event: MouseEvent): void {
        const targetElement: EventTarget = event.currentTarget;

        if (!(targetElement instanceof HTMLElement)) {
            return;
        }

        this.hoverIndex = parseInt(targetElement.dataset.suggestIndex, 10);

        document.dispatchEvent(new CustomEvent('suggestable-item-select', {
            detail: { element: targetElement },
        }));
    }

    /**
     * Handles an event when the cursor leaves the element.
     *
     * @param {MouseEvent} event
     */
    handlerMouseOut(event: MouseEvent): void {
        const targetElement: EventTarget = event.currentTarget;

        if (!(targetElement instanceof HTMLElement)) {
            return;
        }

        this.hoverIndex = -1;

        document.dispatchEvent(new CustomEvent('suggestable-item-unselect', {
            detail: { element: targetElement },
        }));
    }

    /**
     * Handles the mouse up button event.
     *
     * @param {MouseEvent} event
     */
    handlerMouseUp(event: MouseEvent): void {
        const eventTarget: EventTarget = event.target;

        if (!(eventTarget instanceof HTMLElement)) {
            return;
        }

        if (this.containerElement.contains(eventTarget)) {
            return;
        }

        document.dispatchEvent(new CustomEvent('suggestable-hide'));
    }

    /**
     * Handles the click event on suggestion in DOM.
     *
     * @param {Event} event
     */
    handlerClick(event: Event): void {
        const targetElement: EventTarget = event.currentTarget;

        if (!(targetElement instanceof HTMLElement)) {
            return;
        }

        this.inputElement.value = targetElement.dataset.suggestData;

        document.dispatchEvent(new CustomEvent('suggestable-hide'));
        document.dispatchEvent(new CustomEvent('suggestable-click', {
            detail: { item: targetElement },
        }));
    }

    /**
     * Handles "hide suggestion" event.
     */
    handlerSuggestableHide(): void {
        this.containerElement.style.display = 'none';
    }

    /**
     * Handles "show suggestion" event.
     */
    handlerSuggestableShow(): void {
        this.hoverIndex = -1;
        this.containerElement.style.display = 'block';
    }

    /**
     * Handles "select suggestion" event.
     *
     * @param {CustomEvent} event
     */
    handlerSuggestableItemSelect(event: CustomEvent): void {
        const { detail } = event;

        if (!detail) {
            return;
        }

        const { element } = detail;

        if (!(element instanceof HTMLElement)) {
            return;
        }

        Array.prototype.forEach.call(this.getItems(), (item: HTMLElement) => {
            item.classList.remove(this.options['item-active-class']);
        });

        element.classList.add(this.options['item-active-class']);
    }

    /**
     * Handles "deselect suggestion" event.
     *
     * @param {CustomEvent} event
     */
    handlerSuggestableItemUnselect(event: CustomEvent): void {
        const { detail } = event;

        if (!detail) {
            return;
        }

        const { element } = detail;

        if (!(element instanceof HTMLElement)) {
            return;
        }

        element.classList.remove(this.options['item-active-class']);
    }

    /**
     * Handles key down event on input field.
     *
     * @param  {KeyboardEvent} event
     * @return {boolean}
     */
    handlerKeyDown(event: KeyboardEvent): void {
        const keyCode = (event.keyCode || event.which);

        if ([KEY_DOWN, KEY_UP, KEY_ENTER, KEY_NUMENTER].includes(keyCode)) {
            event.preventDefault();
        }

        if (isVisible(this.containerElement)) {
            switch (keyCode) {
                case (KEY_ENTER || KEY_NUMENTER):
                    this.pressEnterKey();
                    break;

                case KEY_UP:
                    this.pressArrowUpKey();
                    break;

                case KEY_DOWN:
                    this.pressArrowDownKey();
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * "Enter" key press action.
     */
    pressEnterKey(): void {
        const items: NodeList<HTMLElement> = this.getItems();

        if (!items.length) {
            return;
        }

        const suggestElement: HTMLElement = items[this.hoverIndex];

        if (!suggestElement) {
            return;
        }

        suggestElement.dispatchEvent(new Event('click'));
    }

    /**
     * "Arrow up" key press action.
     */
    pressArrowUpKey(): void {
        const items: NodeList<HTMLElement> = this.getItems();

        if (!items.length) {
            return;
        }

        if (this.hoverIndex === -1 || this.hoverIndex <= 0) {
            this.hoverIndex = items.length - 1;
        } else {
            this.hoverIndex -= 1;
        }

        const suggestElement: HTMLElement = items[this.hoverIndex];

        if (!suggestElement) {
            return;
        }

        suggestElement.dispatchEvent(new Event('mouseover'));
        this.inputElement.value = suggestElement.dataset.suggestData;
    }

    /**
     * "Arrow down" key press action.
     */
    pressArrowDownKey(): void {
        const items: NodeList<HTMLElement> = this.getItems();

        if (!items.length) {
            return;
        }

        if (this.hoverIndex === -1 || this.hoverIndex >= items.length - 1) {
            this.hoverIndex = 0;
        } else {
            this.hoverIndex += 1;
        }

        const suggestElement: HTMLElement = items[this.hoverIndex];

        if (!suggestElement) {
            return;
        }

        suggestElement.dispatchEvent(new Event('mouseover'));
        this.inputElement.value = suggestElement.dataset.suggestData;
    }

    /**
     * Handles key up event on input field.
     *
     * @param {KeyboardEvent} event
     */
    handlerKeyUp(event: KeyboardEvent): void {
        this.term = this.inputElement.value.trim();

        const keyCode  = (event.keyCode || event.which);
        const cacheKey = `${this.url}:${this.term}`;

        if ([KEY_DOWN, KEY_UP, KEY_ENTER, KEY_NUMENTER, KEY_ESCAPE].indexOf(keyCode) === -1) {
            if (this.term.length >= this.options['term-min-length']) {
                const cachedValue = this.getCachedValue(cacheKey);

                if (!cachedValue) {
                    this.fetchResults().then((data) => {
                        this.cache[cacheKey] = data;
                        this.processResults(data);
                    });
                } else {
                    this.processResults(cachedValue);
                }
            } else {
                document.dispatchEvent(new CustomEvent('suggestable-hide'));
            }
        }

        if (isVisible(this.containerElement) && keyCode === KEY_ESCAPE) {
            document.dispatchEvent(new CustomEvent('suggestable-hide'));
        }
    }
}
