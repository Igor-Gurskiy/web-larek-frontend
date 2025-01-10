import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasket } from '../../types';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.cardList = [];
	}

	set cardList(cardList: HTMLElement[]) {
		if (cardList.length) {
			this._list.replaceChildren(...cardList);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	set valid(value: boolean) {
		this._button.disabled = !value;
	}
}
