import { NodePayloadClass, type NodePayload } from "../Node/payload.svelte";

type ListItemNodePayloadConstructor = {
  id: string;
  value: string;
};

export interface ListItemNodePayload extends NodePayload {}

export class ListItemNodePayloadClass extends NodePayloadClass {
  constructor({ id, value }: ListItemNodePayloadConstructor) {
    super({ id, value, type: "ListItemNode" });
  }

  json(): ListItemNodePayload {
    return {
      id: this.id,
      type: this.type,
      children: this.children.map((child) => child.json()),
    };
  }
}
