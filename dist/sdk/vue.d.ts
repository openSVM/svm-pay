export namespace PaymentButton {
    let name: string;
    namespace props {
        namespace svmPay {
            let type: ObjectConstructor;
            let required: boolean;
        }
        namespace recipient {
            let type_1: StringConstructor;
            export { type_1 as type };
            let required_1: boolean;
            export { required_1 as required };
        }
        namespace amount {
            let type_2: StringConstructor;
            export { type_2 as type };
            let _default: string;
            export { _default as default };
        }
        namespace token {
            let type_3: StringConstructor;
            export { type_3 as type };
            let _default_1: string;
            export { _default_1 as default };
        }
        namespace network {
            let type_4: StringConstructor;
            export { type_4 as type };
            let _default_2: string;
            export { _default_2 as default };
        }
        namespace label {
            let type_5: StringConstructor;
            export { type_5 as type };
            let _default_3: string;
            export { _default_3 as default };
        }
        namespace description {
            let type_6: StringConstructor;
            export { type_6 as type };
            let _default_4: string;
            export { _default_4 as default };
        }
        namespace variant {
            let type_7: StringConstructor;
            export { type_7 as type };
            let _default_5: string;
            export { _default_5 as default };
        }
        namespace size {
            let type_8: StringConstructor;
            export { type_8 as type };
            let _default_6: string;
            export { _default_6 as default };
        }
    }
    function data(): {
        isLoading: boolean;
        error: null;
    };
    namespace computed {
        function buttonClasses(): (string | {
            'svm-pay-button--loading': any;
        })[];
    }
    namespace methods {
        function handleClick(): Promise<void>;
    }
    let template: string;
}
export namespace QRCodePayment {
    let name_1: string;
    export { name_1 as name };
    export namespace props_1 {
        export namespace svmPay_1 {
            let type_9: ObjectConstructor;
            export { type_9 as type };
            let required_2: boolean;
            export { required_2 as required };
        }
        export { svmPay_1 as svmPay };
        export namespace recipient_1 {
            let type_10: StringConstructor;
            export { type_10 as type };
            let required_3: boolean;
            export { required_3 as required };
        }
        export { recipient_1 as recipient };
        export namespace amount_1 {
            let type_11: StringConstructor;
            export { type_11 as type };
            let _default_7: string;
            export { _default_7 as default };
        }
        export { amount_1 as amount };
        export namespace token_1 {
            let type_12: StringConstructor;
            export { type_12 as type };
            let _default_8: string;
            export { _default_8 as default };
        }
        export { token_1 as token };
        export namespace network_1 {
            let type_13: StringConstructor;
            export { type_13 as type };
            let _default_9: string;
            export { _default_9 as default };
        }
        export { network_1 as network };
        export namespace label_1 {
            let type_14: StringConstructor;
            export { type_14 as type };
            let _default_10: string;
            export { _default_10 as default };
        }
        export { label_1 as label };
        export namespace description_1 {
            let type_15: StringConstructor;
            export { type_15 as type };
            let _default_11: string;
            export { _default_11 as default };
        }
        export { description_1 as description };
        export namespace size_1 {
            let type_16: NumberConstructor;
            export { type_16 as type };
            let _default_12: number;
            export { _default_12 as default };
        }
        export { size_1 as size };
    }
    export { props_1 as props };
    export function data(): {
        paymentUrl: string;
        status: null;
        reference: string;
        error: null;
    };
    export namespace computed_1 {
        function isConfirmed(): any;
        function qrCodeStyle(): any;
    }
    export { computed_1 as computed };
    export function mounted(): void;
    export namespace methods_1 {
        function initializePayment(): void;
    }
    export { methods_1 as methods };
    let template_1: string;
    export { template_1 as template };
}
export namespace SVMPayVue {
    function install(Vue: any, options?: {}): void;
}
export default SVMPayVue;
//# sourceMappingURL=vue.d.ts.map