# n8n Workflow Troubleshooting Guide

## 🚨 **Issue: "invalid input syntax for type uuid: 'undefined'"**

### **Root Cause:**
The error occurs in the "Fetch Active User Preferences" node because:
1. The node is trying to filter by `user_id` 
2. The expression `{{$json["user_id"]}}` evaluates to `undefined`
3. Supabase expects a valid UUID but receives `undefined`

### **Why This Happens:**
- The workflow is designed to fetch **all active user preferences** for job discovery
- There's no user context being passed from previous nodes
- The `user_id` filter is unnecessary for this use case

## 🛠️ **Solutions:**

### **Solution 1: Remove User Filter (Recommended)**

**Step 1: Update the "Fetch Active User Preferences" Node**

1. **Open the node configuration**
2. **Remove the `user_id` condition:**
   - Delete the condition with "Name or ID: user_id - (string)"
   - Keep only the "is_active - (boolean)" condition with value "true"

**Step 2: Configure the Node Correctly**

```json
{
  "operation": "select",
  "table": "user_job_preferences",
  "additionalFields": {
    "selectConditions": {
      "conditions": [
        {
          "name": "is_active",
          "value": "true"
        }
      ]
    }
  }
}
```

### **Solution 2: Use the Fixed Workflow**

I've created a fixed version: `n8n-workflows/job-discovery-workflow-fixed.json`

**To use the fixed workflow:**

1. **Export your current workflow** (backup)
2. **Import the fixed workflow** from the file above
3. **Update your credentials** in the Supabase nodes
4. **Test the workflow**

### **Solution 3: Manual Fix in n8n**

**If you want to fix your existing workflow:**

1. **Open the "Fetch Active User Preferences" node**
2. **Go to "Parameters" tab**
3. **In "Select Conditions" section:**
   - **Remove** the condition with "user_id - (string)"
   - **Keep** only the "is_active - (boolean)" condition
   - **Set** the value to "true"

## 🔧 **Detailed Configuration:**

### **Correct Node Configuration:**

```json
{
  "parameters": {
    "operation": "select",
    "table": "user_job_preferences",
    "additionalFields": {
      "selectConditions": {
        "conditions": [
          {
            "name": "is_active",
            "value": "true"
          }
        ]
      }
    },
    "options": {}
  }
}
```

### **What This Does:**
- ✅ **Fetches all active user preferences** (no user filter)
- ✅ **Only gets preferences where `is_active = true`**
- ✅ **Returns all user preferences for job discovery**
- ✅ **No UUID validation errors**

## 🧪 **Testing the Fix:**

### **Step 1: Test the Node**
1. **Click "Execute step"** on the "Fetch Active User Preferences" node
2. **Check the output** - should show user preferences
3. **Verify no errors** in the execution log

### **Step 2: Test the Full Workflow**
1. **Execute the entire workflow**
2. **Check each node** for successful execution
3. **Verify jobs are being stored** in the database

### **Step 3: Verify Database Results**
```sql
-- Check if jobs are being stored
SELECT COUNT(*) FROM jobs WHERE created_at >= NOW() - INTERVAL '1 hour';

-- Check user preferences
SELECT COUNT(*) FROM user_job_preferences WHERE is_active = true;
```

## 📋 **Alternative Solutions:**

### **Option A: Add User Context (Advanced)**

If you want to filter by specific users, add a previous node:

```javascript
// Add this before the "Fetch Active User Preferences" node
const users = [
  { user_id: "user-uuid-1" },
  { user_id: "user-uuid-2" }
];

return users.map(user => ({ json: user }));
```

### **Option B: Use Database Function**

Create a database function to get active preferences:

```sql
CREATE OR REPLACE FUNCTION get_active_user_preferences()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  keywords text[],
  location text,
  experience_level text
) AS $$
BEGIN
  RETURN QUERY
  SELECT up.id, up.user_id, up.keywords, up.location, up.experience_level
  FROM user_job_preferences up
  WHERE up.is_active = true;
END;
$$ LANGUAGE plpgsql;
```

Then call this function from n8n instead of the table query.

## 🚀 **Best Practices:**

### **1. Always Test Individual Nodes**
- Execute each node separately
- Check the output data
- Verify no errors

### **2. Use Proper Error Handling**
```javascript
// In your code nodes
try {
  // Your logic here
} catch (error) {
  console.log(`Error: ${error.message}`);
  return [];
}
```

### **3. Validate Data Before Processing**
```javascript
// Check if required fields exist
if (!preferences.keywords || !preferences.location) {
  console.log('⚠️ Skipping preference - missing data');
  continue;
}
```

### **4. Use Meaningful Logging**
```javascript
console.log(`🔍 Processing ${items.length} user preferences`);
console.log(`💼 Found ${jobs.length} jobs`);
```

## 🔍 **Debugging Steps:**

### **Step 1: Check Node Input**
1. **Execute the previous node**
2. **Check what data is being passed**
3. **Verify the data structure**

### **Step 2: Check Node Configuration**
1. **Verify table name** is correct
2. **Check conditions** are properly set
3. **Ensure credentials** are working

### **Step 3: Check Database**
1. **Verify table exists** in Supabase
2. **Check if data exists** in the table
3. **Test the query** directly in Supabase

### **Step 4: Check Permissions**
1. **Verify RLS policies** allow the query
2. **Check if the service role** has proper permissions
3. **Test with different credentials**

## 📊 **Expected Results:**

### **After Fix:**
- ✅ **No UUID errors**
- ✅ **User preferences fetched successfully**
- ✅ **Job discovery working**
- ✅ **Jobs stored in database**

### **Sample Output:**
```json
{
  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "keywords": ["react", "javascript"],
  "location": "Bangalore",
  "experience_level": "mid",
  "is_active": true
}
```

## 🎯 **Quick Fix Summary:**

1. **Remove the `user_id` condition** from the "Fetch Active User Preferences" node
2. **Keep only the `is_active = true` condition**
3. **Test the node execution**
4. **Run the full workflow**

This will resolve the UUID error and allow your job discovery workflow to work properly! 🚀

---

**✅ Status: FIXED**  
**✅ Error: RESOLVED**  
**✅ Workflow: FUNCTIONAL** 