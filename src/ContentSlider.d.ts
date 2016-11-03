export = ContentSlider;

type QuerySelector = string;
type ClassName = string;
type ContentSliderEvent = "open"
    | "close"
    | "caption_toggle"
    | "next"
    | "prev"
    | "init";

declare class ContentSlider {
    constructor(options: ContentSlider.ContentSliderOptions,
                cssClasses?: ContentSlider.ContentSliderCSSClasses,
                swiperOptions?: any);

    openOverlay(): void;

    closeOverlay(): void;

    toggleCaption(): void;

    on(event:ContentSliderEvent, callback:(...args: any[]) => void);

    onHistoryChange(): void;
}

declare namespace ContentSlider {
    export interface ContentSliderOptions {
        content: QuerySelector;
        overlay: QuerySelector;
        bemBlockName?: string;
        swiperBemBlockName?: string;
        extractSliderElement:(contentElement: Element) => Element;
        extractCaption:(contentElement: Element) => string;
        extractHashnavToken:(contentElement: Element, index: number) => string;
    }

    export interface ContentSliderCSSClasses {
        overlay?: ClassName;
        overlayModVisible?: ClassName;
        nav?: ClassName;
        navPosition?: ClassName;
        caption?: ClassName;
        captionModVisible?: ClassName;
        elementContainer?: ClassName;
        wrapper?: ClassName;
        element?: ClassName;
        icon?: ClassName,
        toggleCaptionIcon?: ClassName,
        toggleCaptionIconModActive?: ClassName,
        prevIcon?: ClassName,
        nextIcon?: ClassName,
        closeIcon?: ClassName,
    }

}
