/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeClass } from "../Node/types.svelte";
import { GenNodePayloadClass } from "./payload.svelte";

export class GenNodeClass extends NodeClass {
  constructor() {
    super({ value: "", children: [], rootChildId: "" });
  }

  appendChild(node: NodeClass, index: number) {}
  serverAppendChild(node: NodeClass, index: number) {}
  shouldJumpToPrev() {
    return true;
  }
  shouldJumpToNext() {
    return true;
  }
  notifyUpdate() {}

  dump() {
    const payload = new GenNodePayloadClass({
      value: this.value,
      id: this.id,
    });

    return payload;
  }
}
