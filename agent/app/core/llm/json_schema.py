def inline_refs(schema: dict) -> dict:
    defs = schema.pop("$defs", {})

    def resolve(node):
        if isinstance(node, dict):
            if "$ref" in node:
                name = node["$ref"].split("/")[-1]   # "#/$defs/QuestionArg" → "QuestionArg"
                return resolve(defs[name])

            return {k: resolve(v) for k, v in node.items()}

        if isinstance(node, list):
            return [resolve(v) for v in node]
        return node

    return resolve(schema)