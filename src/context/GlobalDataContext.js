import { createContext, useContext, useState } from 'react';
import {
  getCategories,
  getAllProducts,
  getAllOrders, // update with your real API names
} from '../api';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [data, setData] = useState({
    categories: null,
    products: null,
    orders: null,
  });

  const [loading, setLoading] = useState({
    categories: false,
    products: false,
    orders: false,
  });

  // 🧠 Unified Lazy Fetch Handler
  const loadDataIfNeeded = async (type) => {
    if (data[type]) return; // already loaded = skip

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      let result;
      switch (type) {
        case 'categories':
          result = await getCategories();
          break;
        case 'products':
          result = await getAllProducts();
          break;
        case 'orders':
          result = await getAllOrders();
          break;
        // loadDataIfNeeded('products') ✅
        case 'products':
          result = await getAllProducts();
          break;

        default:
          throw new Error(`Unknown data type: ${type}`);
      }

      setData((prev) => ({ ...prev, [type]: result.data }));
    } catch (err) {
      console.error(`Failed to load ${type}:`, err.message);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // 🔄 Force Refresh Method
  const refreshData = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      let result;
      switch (type) {
        case 'categories':
          result = await getCategories();
          break;
        case 'products':
          result = await getAllProducts();
          break;
        case 'orders':
          result = await getAllOrders();
          break;
        default:
          throw new Error(`Unknown data type: ${type}`);
      }

      setData((prev) => ({ ...prev, [type]: result.data }));
    } catch (err) {
      console.error(`Failed to refresh ${type}:`, err.message);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <GlobalDataContext.Provider
      value={{
        data,
        loading,
        loadDataIfNeeded,
        refreshData,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

// 🧼 Reusable Hook
export const useGlobalData = () => useContext(GlobalDataContext);
