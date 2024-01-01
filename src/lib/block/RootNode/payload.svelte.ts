import { NodePayloadClass, type NodePayload } from "../Node/payload.svelte";

export interface RootNodePayload extends NodePayload {}

export class RootNodePayloadClass extends NodePayloadClass {
  constructor() {
    super({ id: "root", value: "", type: "RootNode" });
  }

  json(): RootNodePayload {
    return {
      id: this.id,
      type: this.type,
      children: this.children.map((child) => child.json()),
      value: this.value,
    };
  }
}
