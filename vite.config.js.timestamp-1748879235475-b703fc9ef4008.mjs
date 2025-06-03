// vite.config.js
import { defineConfig } from "file:///C:/Users/blaze/OneDrive/Desktop/zaryahplus(jsx)/ZaryahX/ZaryahX/islamic-finance-oasis/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/blaze/OneDrive/Desktop/zaryahplus(jsx)/ZaryahX/ZaryahX/islamic-finance-oasis/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/blaze/OneDrive/Desktop/zaryahplus(jsx)/ZaryahX/ZaryahX/islamic-finance-oasis/node_modules/lovable-tagger/dist/index.js";
import { NodeGlobalsPolyfillPlugin } from "file:///C:/Users/blaze/OneDrive/Desktop/zaryahplus(jsx)/ZaryahX/ZaryahX/islamic-finance-oasis/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import { NodeModulesPolyfillPlugin } from "file:///C:/Users/blaze/OneDrive/Desktop/zaryahplus(jsx)/ZaryahX/ZaryahX/islamic-finance-oasis/node_modules/@esbuild-plugins/node-modules-polyfill/dist/index.js";
import rollupNodePolyFill from "file:///C:/Users/blaze/OneDrive/Desktop/zaryahplus(jsx)/ZaryahX/ZaryahX/islamic-finance-oasis/node_modules/rollup-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\blaze\\OneDrive\\Desktop\\zaryahplus(jsx)\\ZaryahX\\ZaryahX\\islamic-finance-oasis";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react({ jsxRuntime: "automatic" }),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      // This is needed for ethers.js and other libraries that use Node.js modules
      "buffer": "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      "process": "rollup-plugin-node-polyfills/polyfills/process-es6",
      "stream": "rollup-plugin-node-polyfills/polyfills/stream",
      "util": "rollup-plugin-node-polyfills/polyfills/util"
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        rollupNodePolyFill()
      ]
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxibGF6ZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHphcnlhaHBsdXMoanN4KVxcXFxaYXJ5YWhYXFxcXFphcnlhaFhcXFxcaXNsYW1pYy1maW5hbmNlLW9hc2lzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxibGF6ZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHphcnlhaHBsdXMoanN4KVxcXFxaYXJ5YWhYXFxcXFphcnlhaFhcXFxcaXNsYW1pYy1maW5hbmNlLW9hc2lzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ibGF6ZS9PbmVEcml2ZS9EZXNrdG9wL3phcnlhaHBsdXMoanN4KS9aYXJ5YWhYL1phcnlhaFgvaXNsYW1pYy1maW5hbmNlLW9hc2lzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcbmltcG9ydCB7IE5vZGVHbG9iYWxzUG9seWZpbGxQbHVnaW4gfSBmcm9tICdAZXNidWlsZC1wbHVnaW5zL25vZGUtZ2xvYmFscy1wb2x5ZmlsbCc7XHJcbmltcG9ydCB7IE5vZGVNb2R1bGVzUG9seWZpbGxQbHVnaW4gfSBmcm9tICdAZXNidWlsZC1wbHVnaW5zL25vZGUtbW9kdWxlcy1wb2x5ZmlsbCc7XHJcbmltcG9ydCByb2xsdXBOb2RlUG9seUZpbGwgZnJvbSAncm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KHsganN4UnVudGltZTogJ2F1dG9tYXRpYycgfSksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XG4gICAgZXh0ZW5zaW9uczogWycuanMnLCAnLmpzeCcsICcuanNvbiddLFxyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGZvciBldGhlcnMuanMgYW5kIG90aGVyIGxpYnJhcmllcyB0aGF0IHVzZSBOb2RlLmpzIG1vZHVsZXNcclxuICAgICAgJ2J1ZmZlcic6ICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9idWZmZXItZXM2JyxcclxuICAgICAgJ3Byb2Nlc3MnOiAncm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvcHJvY2Vzcy1lczYnLFxyXG4gICAgICAnc3RyZWFtJzogJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3N0cmVhbScsXHJcbiAgICAgICd1dGlsJzogJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3V0aWwnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgLy8gTm9kZS5qcyBnbG9iYWwgdG8gYnJvd3NlciBnbG9iYWxUaGlzXHJcbiAgICAgIGRlZmluZToge1xyXG4gICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBFbmFibGUgZXNidWlsZCBwb2x5ZmlsbCBwbHVnaW5zXHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luKHtcclxuICAgICAgICAgIHByb2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICBidWZmZXI6IHRydWUsXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgTm9kZU1vZHVsZXNQb2x5ZmlsbFBsdWdpbigpLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAvLyBFbmFibGUgcm9sbHVwIHBvbHlmaWxscyBwbHVnaW5cclxuICAgICAgICByb2xsdXBOb2RlUG9seUZpbGwoKSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1jLFNBQVMsb0JBQW9CO0FBQ2hlLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxpQ0FBaUM7QUFDMUMsU0FBUyxpQ0FBaUM7QUFDMUMsT0FBTyx3QkFBd0I7QUFOL0IsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTSxFQUFFLFlBQVksWUFBWSxDQUFDO0FBQUEsSUFDakMsU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLFlBQVksQ0FBQyxPQUFPLFFBQVEsT0FBTztBQUFBLElBQ25DLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQTtBQUFBLE1BRXBDLFVBQVU7QUFBQSxNQUNWLFdBQVc7QUFBQSxNQUNYLFVBQVU7QUFBQSxNQUNWLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUE7QUFBQSxNQUVkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFNBQVM7QUFBQSxRQUNQLDBCQUEwQjtBQUFBLFVBQ3hCLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWLENBQUM7QUFBQSxRQUNELDBCQUEwQjtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQTtBQUFBLFFBRVAsbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
