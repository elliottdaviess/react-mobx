import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

const StoreContext = React.createContext();

const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    //mobx store wrapped in context
    items: ["Example Item"],
    addItem: (item) => {
      store.items.push(item);
    },
    get itemsCount() {
      return store.items.length;
    },
  }));

  return (
    //store as value of context provider. Made available to all children.
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

const ItemsHeader = () => {
  const store = React.useContext(StoreContext);
  return useObserver(() => <h1>{store.itemsCount} Items!</h1>); //useObserver() to observe changes to the store (via the provider)
};

const ItemsList = () => {
  const store = React.useContext(StoreContext);

  return useObserver(() => (
    <ul>
      {store.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ));
};

const ItemsForm = () => {
  const store = React.useContext(StoreContext);
  const [item, setItem] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        store.addItem(item); //mutate store value. Accessed through store.
        setItem("");
        e.preventDefault();
      }}
    >
      <input
        type="text"
        value={item}
        onChange={(e) => {
          setItem(e.target.value);
        }}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <main>
        <ItemsHeader />
        <ItemsList />
        <ItemsForm />
      </main>
    </StoreProvider>
  );
}
