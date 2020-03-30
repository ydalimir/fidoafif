import { flow, types } from 'mobx-state-tree';
import { apiGetCategories, apiGetProductById } from '../../utils/api';
const EditProduct = types
  .model('EditProductStore', {
    id: types.optional(types.string, ''),
    id_category: types.optional(types.string, ''),
    category: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    sku: types.optional(types.string, ''),
    price: types.optional(types.string, ''),
    het: types.optional(types.string, ''),
    javaPrice: types.optional(types.string, ''),
    stock: types.optional(types.string, ''),
    weight: types.optional(types.string, ''),
    images: types.array(
      types.model('EditProductStore_ProductModel_ImagesModel', {
        uri: types.optional(types.string, ''),
      }),
    ),

    loading: types.optional(types.boolean, false),
  })
  .actions(self => {
    const clearStore = () => {
      self.id = '';
      self.id_category = '';
      self.category = '';
      self.name = '';
      self.price = '';
      self.het = '';
      self.javaPrice = '';
      self.sku = '';
      self.stock = '';
      self.weight = '';
      self.images.clear();
      self.loading = false;
    };

    const setProduct = flow(function*(data) {
      self.id = data.id_product;
      self.id_category = data.id_category;
      self.name = data.name;
      self.price = data.harga_luar_jawa ? data.harga_luar_jawa : '';
      self.javaPrice = data.harga_jawa ? data.harga_jawa : '';
      self.sku = data.sku;
      self.stock = data.stock;
      self.weight = data.weight;
      self.description = data.description;
      self.het = data.het;

      try {
        const response = yield apiGetCategories();

        if (response.data.length) {
          response.data.forEach(element => {
            if (element.id_category === data.id_category) {
              self.category = element.name;
            }
          });
        }
      } catch (error) {
        // return null;
      }
    });

    const setIdCategory = value => {
      // console.log(value);
      self.id_category = value.id_category + '';
      self.category = value.name;
    };

    const setName = value => {
      self.name = value;
    };

    const setDescription = value => {
      self.description = value;
    };

    const setPrice = value => {
      self.price = value;
    };

    const setHetPrice = value => {
      self.het = value;
    };

    const setJavaPrice = value => {
      self.javaPrice = value;
    };

    const setSku = value => {
      self.sku = value;
    };

    const setStock = value => {
      self.stock = value;
    };

    const setWeight = value => {
      self.weight = value;
    };

    const fetchProductsById = flow(function*(productId) {
      try {
        self.loading = true;
        const response = yield apiGetProductById(productId);

        return response.data;
        // if (response.data) setProduct(response.data);
      } catch (error) {
        return null;
      } finally {
        self.loading = false;
      }
    });

    return {
      clearStore,
      setProduct,

      setIdCategory,
      setName,
      setDescription,
      setPrice,
      setJavaPrice,
      setSku,
      setStock,
      setWeight,
      setHetPrice,

      fetchProductsById,
    };
  });

const EditProductStore = EditProduct.create({
  loading: false,
});

export default EditProductStore;
