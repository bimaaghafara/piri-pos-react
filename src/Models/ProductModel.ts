export class MProductVariant {
    product: {
      spicy: boolean;
      kidsMenu: boolean;
      containPork: boolean;
      chefRecommended: boolean;
      id: string;
      code: string;
      name: string;
      description: string;
      categoryId: string;
      taxable: boolean;
      serviceChargeable: boolean;
      availableForSale: boolean;
      availableInAllOutlets: boolean;
      variantAttribute1Id: string;
      variantAttribute2Id: string;
      variantAttribute3Id: string;
      variantCount: number;
      pictureId: string;
      inactive: boolean;
      rowVersion: string;
      category: {
        id: string;
        name: string;
        sortOrder: number;
      };
      variantAttribute1: {
        id: string;
        name: string;
      };
      variantAttribute2: {
        id: string;
        name: string;
      };
      variantAttribute3: {
        id: string;
        name: string;
      };
      picture: {
        id: string;
        fileType: string;
        fileName: string;
        fileExt: string;
        fileSize: number;
        description: string;
        uploadByUserId: string;
        fileUrl: string;
        thumbnailUrl: string;
      };
      addonGroups: [
        {
          id: string;
          name: string;
        }
      ];
      outlets: [
        {
          id: number;
          name: string;
        }
      ];
      unitPrice: number;
    };
    soldOut: boolean;
    printArea: string;
    id: string;
    productId: string;
    sku: string;
    name: string;
    variantCode: string;
    variantName: string;
    attribute1Value: string;
    attribute2Value: string;
    attribute3Value: string;
    unitPrice: number;
    availableForSale: boolean;
    isMaster: boolean;
    inactive: boolean;
    rowVersion: string
  }
  