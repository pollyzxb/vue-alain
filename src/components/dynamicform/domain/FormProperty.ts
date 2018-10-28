import { DFSchema } from './../schema/DfSchema';
import { DFUISchemaItem } from './../schema/UiSchema';

// tslint:disable:variable-name
export default class FormProperty {
    public formData: any = {};

    private _formSchem: DFSchema = {};
    private _uiSchema: DFUISchemaItem = {};
    private _propertyId: string = '' ;

    private _required: string[] = [];

    constructor(
        propertyId: string ,
        formSchema: DFSchema,
        uiSchema: DFUISchemaItem,
        required: string[] = []) {
        this._propertyId = propertyId;
        /*
        this._id = id;
        this._fieldKey = fieldKey;
        this._formData = formdata;
        this._attrs = attrs;
        this._visiable = visiable;
        this._title = title;
        */
        this._formSchem = formSchema;
        this._uiSchema = uiSchema;
        this._required = required;
    }

    get key(): string {
        return this._propertyId;
    }

    get id(): string {
        return `$$${this._propertyId}`;
    }

    get formSchema(): DFSchema {
        if (this._formSchem == null) {
            return {};
        }
        return this._formSchem;
    }

    get uiSchema(): DFUISchemaItem {
        if (this._uiSchema == null) {
            return {};
        }
        return this._uiSchema;
    }

    get type() {
        return this.uiSchema.widget || this.formSchema.type;
    }

    get formitemAttrs() {
        const attrs = this.ui.itemattrs;
        attrs.fieldDecoratorId = this.key;
        attrs.fieldDecoratorOptions = this.fieldDecoratorOptions;
        return attrs;
    }

    get widgetAttrs() {
        return this.ui.widgetattrs;
    }

    get ui(): any {
        const propertyUi: any = this.formSchema.ui;
        const ui = {
            ...propertyUi,
            ...this.uiSchema,
        };
        return ui;
    }

    get label(): string {
        if (this.formSchema.title) {
            return this.formSchema.title;
        }
        if (this.uiSchema.widgetattrs && this.uiSchema.widgetattrs.label) {
            return this.uiSchema.widgetattrs.label;
        }
        return this.key;
    }

    get listSource(): any[] {
        if (!this.formSchema.enum) {
            return [];
        }
        return this.formSchema.enum;
    }

    get rules(): any[] {
        const rules: any[] = [];
        const isRequired = this._required.includes(this.key);
        if (isRequired) {
            let msg = '必填项';
            if (this.ui.errors) {
                msg = this.ui.errors.required;
            }
            rules.push({ required: true, message: msg });
        }
        if (this.formSchema.maxLength) {
            let msg = '超过最大长度';
            if (this.ui.errors) {
                msg = this.ui.errors.maxLength;
            }
            rules.push({ max: this.formSchema.maxLength, message: msg });
        }
        if (this.formSchema.minLength) {
            let msg = '最小长度';
            if (this.ui.errors) {
                msg = this.ui.errors.minLength;
            }
            rules.push({ min: this.formSchema.minLength, message: msg });
        }
        if (this.formSchema.pattern) {
            let msg = '正则表达式不正确';
            if (this.ui.errors) {
                msg = this.ui.errors.pattern;
            }
            rules.push({ pattern: this.formSchema.pattern, message: msg });
        }
        if (this.formSchema.maximum) {
            let msg = '最大数';
            if (this.ui.errors) {
                msg = this.ui.errors.maximum;
            }
            rules.push({ type: 'number', max: this.formSchema.maximum, message: msg });
        }
        if (this.formSchema.minimum) {
            let msg = '最小数';
            if (this.ui.errors) {
                msg = this.ui.errors.minimum;
            }
            rules.push({ type: 'number', min: this.formSchema.minimum, message: msg });
        }
        // { required: true, message: '请输入姓名' }
        return rules;
    }

    get fieldDecoratorOptions(): any {
        return {
            initialValue: this.formData[this.key],
            rules: this.rules,
        };
    }
}