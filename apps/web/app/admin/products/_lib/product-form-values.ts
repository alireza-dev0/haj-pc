export type ProductImageFormValue = {
    url: string;
    isPrimary: boolean;
    file?: File;
};

export type ProductFormValues = {
    name: string;
    categoryId: string;
    price: string;
    stock: string;
    description: string;
    images: ProductImageFormValue[];
};
