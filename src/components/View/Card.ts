import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ICard, IActions } from '../../types';

const colorsCategory: Record<string, string> = {
	'софт-скил': '_soft',
	'хард-скил': '_hard',
	'другое': '_other',
	'дополнительное': '_additional',
	'кнопка': '_button',
};

// Класс для карточки в каталоге, корзине и модальном окне
export class Card extends Component<ICard> {
	protected _id: string;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _addButton?: HTMLButtonElement;

	protected _index?: HTMLElement;
	protected _removeButton?: HTMLButtonElement;
	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._description = container.querySelector('.card__text');
		this._addButton = container.querySelector('.card__button');

		this._index = container.querySelector('.basket__item-index');
		this._removeButton = container.querySelector(
			'.basket__item-delete'
		);

		if (actions) {
			if (this._removeButton) {
				this._removeButton.addEventListener('click', actions.onClick);
			} else if (this._addButton) {
				this._addButton.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, String(value + 1));
	}

	set id(value: string) {
		this.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.setColor(this._category, value);
	}

	protected setColor(element: HTMLElement, value: string) {
		element.classList.replace(
			element.classList[1],
			`card__category${colorsCategory[value]}`
		);
	}
	set price(value: number) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			if (this._addButton) {
				this._addButton.disabled = true;
			}
		}
	}

	set textButton(value: string) {
		this._addButton.textContent = value;
	}
}