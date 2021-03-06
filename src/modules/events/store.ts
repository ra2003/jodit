/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CallbackFunction, EventHandlerBlock, IDictionary } from '../../types';

export const defaultNameSpace = 'JoditEventDefaultNamespace';

export class EventHandlersStore {
	private __store: IDictionary<IDictionary<EventHandlerBlock[]>> = {};

	get(event: string, namespace: string): EventHandlerBlock[] | void {
		if (this.__store[namespace] !== undefined) {
			return this.__store[namespace][event];
		}
	}

	indexOf(
		event: string,
		namespace: string,
		originalCallback: CallbackFunction
	): false | number {
		const blocks: EventHandlerBlock[] | void = this.get(event, namespace);

		if (blocks) {
			for (let i = 0; i < blocks.length; i += 1) {
				if (blocks[i].originalCallback === originalCallback) {
					return i;
				}
			}
		}

		return false;
	}

	namespaces(withoutDefault: boolean = false): string[] {
		const nss = Object.keys(this.__store);
		return withoutDefault ? nss.filter(ns => ns !== defaultNameSpace) : nss;
	}

	events(namespace: string): string[] {
		return this.__store[namespace]
			? Object.keys(this.__store[namespace])
			: [];
	}

	set(
		event: string,
		namespace: string,
		data: EventHandlerBlock,
		onTop: boolean = false
	) {
		if (this.__store[namespace] === undefined) {
			this.__store[namespace] = {};
		}

		if (this.__store[namespace][event] === undefined) {
			this.__store[namespace][event] = [];
		}

		if (!onTop) {
			this.__store[namespace][event].push(data);
		} else {
			this.__store[namespace][event].unshift(data);
		}
	}

	clear() {
		delete this.__store;
		this.__store = {};
	}
}
