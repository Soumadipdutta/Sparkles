# 🧪 Frontend Testing Sandbox & Workbench

Welcome to your dedicated **Frontend Testing Space**.
This isolated Vite + React application lets you test, preview, and compare different `.jsx` frontend versions without touching your teammate's `Frontend` folder or altering the backend integration (`SIH/integrated_frontend`).

---

## 🚀 How to Run the Workbench

> [!NOTE]
> `npm install` is **already done**! You only need to run `npm install` **once** when setting up a Node project.
> For daily testing, you **never** need to run `npm install` again.

Open your terminal in `Frontend_Tester` and run:

```bash
cd Frontend_Tester
npm run dev
```

The workbench will open automatically in your browser at `http://localhost:3000` (or `http://localhost:5173`).


---

## ➕ How to Test a New `.jsx` File

Whenever you have a new `.jsx` component or page candidate to test:

### Step 1: Add your `.jsx` file
Save your `.jsx` file in the `src/test_components/` folder:
`Frontend_Tester/src/test_components/MyNewDesign.jsx`

### Step 2: Register it in `componentRegistry.js`
Open `Frontend_Tester/src/sandbox/componentRegistry.js` and add an entry:

```javascript
import MyNewDesign from '../test_components/MyNewDesign';

// Add to registeredComponents array:
registeredComponents.push({
  id: 'my-new-design-v1',
  title: 'My New Design Candidate',
  category: 'Dashboards', // or 'Pages', 'Reports', etc.
  version: 'v1.0',
  description: 'Clean modern layout prototype.',
  component: MyNewDesign,
  badge: 'Candidate'
});
```

### Step 3: View & Compare Live
That's it! Your new component will immediately show up in the Workbench sidebar where you can:
- **Switch between designs** with 1 click.
- **Test responsive viewports** (Laptop 1280px, Tablet 768px, Mobile 375px, or Fluid).
- **Test themes** (Dark, Light, Slate, Midnight).
- **Reset component state** or catch render bugs safely without app crashes.
