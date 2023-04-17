·       Ability to delete the memo with confirmation message.  ·       Ability to download the data in excel format.  ·       Ability to submit and reset the form.  ·       Memo should not be empty.  ·       If user has access then user able to access this page.  ·       If user didn’t have access then redirect to login page.

({ 
    doInit: function(component, event, helper) {
        // check if user has access
        var action = component.get("c.checkUserAccess");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var userAccess = response.getReturnValue();
                if (userAccess) {
                    // get executive memos list
                    var action = component.get("c.getExecutiveMemos");
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            var executiveMemos = response.getReturnValue();
                            component.set("v.executiveMemos", executiveMemos);
                        } else {
                            console.log("Failed with state: " + state);
                        }
                    });
                    $A.enqueueAction(action);
                } else {
                    // redirect to login page
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": '/login'
                    });
                    urlEvent.fire();
                }
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    addMemo : function(component, event, helper) {
        // open add memo modal
        component.set("v.showModal",true);
    },
    closeModal : function(component, event, helper) {
        // close add memo modal
        component.set("v.showModal",false);
    },
    editMemo : function(component, event, helper) {
        // open edit memo modal
        component.set("v.showEditModal",true);
    },
    closeEditModal : function(component, event, helper) {
        // close edit memo modal
        component.set("v.showEditModal",false);
    },
    deleteMemo : function(component, event, helper) {
        // open delete memo modal
        component.set("v.showDeleteModal",true);
    },
    closeDeleteModal : function(component, event, helper) {
        // close delete memo modal
        component.set("v.showDeleteModal",false);
    },
    downloadData : function(component, event, helper) {
        // download data as csv file
        var action = component.get("c.downloadData");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                // create csv file
                var csvContent = "data:text/csv;charset=utf-8,";
                csvContent += data;
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "data.csv");
                document.body.appendChild(link);
                link.click();
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    submitForm : function(component, event, helper) {
        // get memo field
        var memo = component.find("memo").get("v.value");
        // check if memo is empty
        if (!memo) {
            component.set("v.errorMessage", "Memo should not be empty");
            return;
        }
        // submit form
        var action = component.get("c.submitForm");
        action.setParams({
            "memo": memo
        });
        action.setCallback(this, function(response) {
            var state = response