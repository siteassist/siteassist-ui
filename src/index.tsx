import './globals.css';

import {createRoot} from 'react-dom/client';

import ChatButtonWidget from './widgets/chat-button-widget';
import type {ChatBoxWidgetProps} from './widgets/chatbox-widget';
import ChatBoxWidget from './widgets/chatbox-widget';

export const normalizeAttribute = (attribute: string) => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

function getPropsFromAttributes<T>(attributes: NamedNodeMap): T {
  const props: Record<string, string> = {};

  for (let index = 0; index < attributes.length; index++) {
    const attribute = attributes[index];
    props[normalizeAttribute(attribute.name)] = attribute.value;
  }

  return props as T;
}

class ChatBoxWidgetEl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    const props = getPropsFromAttributes<ChatBoxWidgetProps>(this.attributes);
    const root = createRoot(this.shadowRoot!);
    root.render(<ChatBoxWidget {...props} root={this.shadowRoot!} />);
  }
}

customElements.define('sa-chatbox', ChatBoxWidgetEl);

class ChatButtonWidgetEl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    const root = createRoot(this.shadowRoot!);
    root.render(<ChatButtonWidget />);
  }
}

customElements.define('sa-chat-button', ChatButtonWidgetEl);
