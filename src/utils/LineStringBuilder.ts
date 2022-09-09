export class LineStringBuilder {
    protected stringBuilder: string[] = [];

    public addFieldLine(property: string, value: any, code: boolean = false): this {
        if (property && value) {
            switch (code) {
                case true: {
                    this.newLineAppend(`**${property}:** \`${value.toString()}\``);
                    break;
                }
                case false: {
                    this.newLineAppend(`**${property}:** ${value.toString()}`);
                    break;
                }
            }
        }

        return this;
    }

    public append(data: any): this {
        this.stringBuilder.push(data);

        return this;
    }

    public newLineAppend(data: any): this {
        this.stringBuilder.push(data + "\n");

        return this;
    }

    public build(): string {
        return this.stringBuilder.join("");
    }
}
