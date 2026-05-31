type FieldErrors<FieldName extends string> = Partial<Record<FieldName, string>>;

function getFieldLabelElement(fieldElement: HTMLElement) {
    const labelableElement = fieldElement as HTMLElement & {
        labels?: NodeListOf<HTMLLabelElement> | null;
    };
    const associatedLabel = labelableElement.labels?.item(0);

    if (associatedLabel) {
        return associatedLabel;
    }

    if (!fieldElement.id) {
        return null;
    }

    return (
        Array.from(document.querySelectorAll<HTMLLabelElement>("label[for]")).find(
            (labelElement) => labelElement.htmlFor === fieldElement.id
        ) ?? null
    );
}

function scrollFieldInsideModal(fieldElement: HTMLElement, scrollTarget: HTMLElement) {
    const dialog = fieldElement.closest('[role="dialog"]');
    const dialogElement = dialog instanceof HTMLElement ? dialog : null;
    const modalViewport = fieldElement.closest('[data-modal-viewport="true"]');
    const modalViewportElement = modalViewport instanceof HTMLElement ? modalViewport : null;
    const scrollContainer = dialog?.querySelector<HTMLElement>(
        '[data-modal-scroll-container="true"]'
    );

    if (!scrollContainer?.contains(scrollTarget)) {
        scrollTarget.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });
        return;
    }

    if (modalViewportElement) {
        modalViewportElement.scrollTop = 0;
    }

    if (dialogElement) {
        dialogElement.scrollTop = 0;
    }

    const targetBounds = scrollTarget.getBoundingClientRect();
    const scrollBounds = scrollContainer.getBoundingClientRect();
    const scrollPadding = 16;
    const nextScrollTop =
        scrollContainer.scrollTop + targetBounds.top - scrollBounds.top - scrollPadding;

    scrollContainer.scrollTo({
        top: Math.max(nextScrollTop, 0),
        behavior: "smooth",
    });

    if (dialogElement) {
        dialogElement.scrollTop = 0;
    }

    if (modalViewportElement) {
        modalViewportElement.scrollTop = 0;
    }
}

export function scrollToFirstFieldError<FieldName extends string>(
    errors: FieldErrors<FieldName>,
    fieldOrder: readonly FieldName[],
    fieldIdByName: Partial<Record<FieldName, string>>
) {
    const firstErrorField = fieldOrder.find((fieldName) => Boolean(errors[fieldName]));

    if (!firstErrorField) {
        return;
    }

    window.requestAnimationFrame(() => {
        const fieldId = fieldIdByName[firstErrorField];
        const fieldElement = fieldId ? document.getElementById(fieldId) : null;

        if (!fieldElement) {
            return;
        }

        if (fieldElement instanceof HTMLElement) {
            scrollFieldInsideModal(
                fieldElement,
                getFieldLabelElement(fieldElement) ?? fieldElement
            );
            fieldElement.focus({ preventScroll: true });
            fieldElement.closest<HTMLElement>('[role="dialog"]')?.scrollTo({ top: 0 });
            fieldElement.closest<HTMLElement>('[data-modal-viewport="true"]')?.scrollTo({ top: 0 });
        }
    });
}
