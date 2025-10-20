# 🚀 How to Start Bake.lk Cake Management System

## ✅ **Both servers are now running successfully!**

### 🌐 **Access your application:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📋 **Manual Startup Instructions**

### **Option 1: Using the batch file (Recommended)**
1. Double-click `start-servers.bat` in the root directory
2. This will open two command windows automatically

### **Option 2: Manual startup**

#### **Start Backend Server:**
```bash
# Open Command Prompt or PowerShell
cd "C:\Users\dell\Downloads\Telegram Desktop\Latest Cake Manamgement System\Latest Cake Manamgement System\Latest Cake Manamgement System\cake-management-system\Backend"
npm start
```

#### **Start Frontend Server:**
```bash
# Open another Command Prompt or PowerShell
cd "C:\Users\dell\Downloads\Telegram Desktop\Latest Cake Manamgement System\Latest Cake Manamgement System\Latest Cake Manamgement System\cake-management-system\Frontend"
npm run dev
```

---

## ⚠️ **Common Issues & Solutions**

### **Error: "Cannot find module" or "package.json not found"**
- **Problem**: Running npm commands from wrong directory
- **Solution**: Make sure you're in the correct directory:
  - For Backend: `cd Backend` then `npm start`
  - For Frontend: `cd Frontend` then `npm run dev`

### **Error: "Port already in use"**
- **Solution**: 
  - Backend: Change port in `Backend/server.js` (line 36)
  - Frontend: Change port in `Frontend/vite.config.js`

---

## 🎯 **Testing the Loyalty System**

1. **Open browser**: Go to http://localhost:5173
2. **Register/Login**: Create an account or login
3. **Add to cart**: Add some cakes to your cart
4. **Place order**: Go through checkout process
5. **Check profile**: Visit `/profile` to see your loyalty points
6. **View orders**: Visit `/myorders` to see order history

---

## 🔧 **Development Commands**

### **Backend Commands:**
```bash
cd Backend
npm start          # Start server
npm install        # Install dependencies
```

### **Frontend Commands:**
```bash
cd Frontend
npm run dev        # Start development server
npm run build      # Build for production
npm install        # Install dependencies
```

---

## 📁 **Project Structure**
```
cake-management-system/
├── Backend/           # Node.js + Express API
│   ├── server.js      # Main server file
│   ├── package.json   # Backend dependencies
│   └── ...
├── Frontend/          # React + Vite frontend
│   ├── src/          # React source code
│   ├── package.json  # Frontend dependencies
│   └── ...
└── start-servers.bat # Quick start script
```

---

## 🎉 **Your loyalty system is ready!**

The system will automatically:
- ⭐ Award points based on order amounts
- 🏆 Update user levels (Silver → Gold → Platinum)  
- 💰 Apply discounts for Gold/Platinum members
- 📊 Track all points and order history

**Happy coding!** 🍰✨





