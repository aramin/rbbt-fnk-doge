
declare namespace ContentSliderModule {
    type QuerySelector = string;
    type ClassName = string;
    type ContentSliderEvent = "open"
        | "close"
        | "caption_toggle"
        | "next"
        | "prev"
        | "init"
        | "zoom-active"
        | "zoom-inactive";

    interface ContentSliderModule {
        OverlayContentSlider: OverlayContentSlider;
        SimpleContentSlider: SimpleContentSlider;
    }

    interface OverlayContentSliderOptions {
        content: QuerySelector;
        triggerSelector: QuerySelector;
        overlay: QuerySelector;
        bemBlockName?: string;
        swiperBemBlockName?: string;
        extractSliderElement: (contentElement: Element) => Element;
        extractCaption: (contentElement: Element) => string;
        extractHashnavToken: (contentElement: Element, index: number) => string;
    }

    interface SimpleContentSliderOptions {
        root: Element;
        container: QuerySelector;
        bemBlockName?: string;
        swiperBemBlockName?: string;
    }

    interface ContentSliderCSSClasses {
        overlay?: ClassName;
        overlayModVisible?: ClassName;
        nav?: ClassName;
        navPosition?: ClassName;
        caption?: ClassName;
        captionModVisible?: ClassName;
        elementContainer?: ClassName;
        wrapper?: ClassName;
        element?: ClassName;
        icon?: ClassName;
        toggleCaptionIcon?: ClassName;
        toggleCaptionIconModActive?: ClassName;
        prevIcon?: ClassName;
        nextIcon?: ClassName;
        closeIcon?: ClassName;
    }

    export class OverlayContentSlider {
        constructor(options: OverlayContentSliderOptions,
                    cssClasses?: ContentSliderCSSClasses,
                    swiperOptions?: any);

        // the swiper instance
        public swiper: any;
        public elements: {
            content: Array<Element>,
            triggerContent: Array<Element>,
            overlay: Element,
            caption: Element,
            elementsContainer: Element,
            toggleCaptionIcon: Element,
            closeIcon: Element,
            nav: Element,
            navPosition: Element
        };

        public openOverlay(): void;

        public closeOverlay(): void;

        public toggleCaption(): void;

        public on(event: ContentSliderEvent, callback: (...args: any[]) => void): void;

        public onHistoryChange(): void;
    }

    export class SimpleContentSlider {
        constructor(options: SimpleContentSliderOptions,
                    cssClasses?: ContentSliderCSSClasses,
                    swiperOptions?: any);

        // the swiper instance
        public swiper: any;

        public on(event: ContentSliderEvent, callback: (...args: any[]) => void): void;
    }
}

export = ContentSliderModule;