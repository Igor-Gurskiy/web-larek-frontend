import { CDN_URL } from '../../utils/constants';

export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = `${CDN_URL}${src}`;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
