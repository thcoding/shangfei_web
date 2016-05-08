/* =====================================================================================
(This wrapper is designed to work with both of SCORM 1.2 and SCORM 2004.)

Based on APIWrapper.js, created by the ADL and Concurrent Technologies
Corporation, distributed by the ADL (http://www.adlnet.gov/scorm).

SCORM.API.find() and SCORM.API.get() functions based on ADL code,
modified by Mike Rustici (http://www.scorm.com/resources/apifinder/SCORMAPIFinder.htm),
further modified by Philip Hutchison
Based on SCORM wrapper (Philip Hutchison, May 2008 http://pipwerks.com)

MIT-style license. http://www.opensource.org/licenses/mit-license.php

======================================================================================== */

var common = {};
common.UTILS = {};
common.debug = {isActive: false};
// ------------------------------------------------------------------------- //
common.SCORM = {
    version: "1.2",
    handleCompletionStatus: true,
    handleExitMode: true,
    API: { handle: null,
           isFound: false
    },
    connection: { isActive: false },
    data: { completionStatus: null,
        exitStatus: null},
    debug: {}
};


// ------------------------------------------------------------------------- //
common.SCORM.isAvailable = function() {
    return true;
};

// ------------------------------------------------------------------------- //
common.SCORM.getVersion = function() {
    return common.SCORM.version
}

// ------------------------------------------------------------------------- //

common.SCORM.API.find = function(win) {

    var API = null,
		findAttempts = 0,
        findAttemptLimit = 500,
		traceMsgPrefix = "SCORM.API.find",
		trace = common.UTILS.trace,
		scorm = common.SCORM;

    while ((!win.API && !win.API_1484_11) &&
           (win.parent) &&
           (win.parent != win) &&
           (findAttempts <= findAttemptLimit)) {

        findAttempts++;
        win = win.parent;
    }
    if (scorm.version) {		//If SCORM version is specified by user, look for specific API
        switch (scorm.version) {
            case "2004":

                if (win.API_1484_11) {

                    API = win.API_1484_11;

                } else {

                    trace(traceMsgPrefix + ": SCORM version 2004 was specified by user, but API_1484_11 cannot be found.");
                }
                break;
            case "1.2":
                if (win.API) {
                    API = win.API;
                } else {
                    trace(traceMsgPrefix + ": SCORM version 1.2 was specified by user, but API cannot be found.");
                }
                break;
        }
    } else {													//If SCORM version not specified by user, look for APIs

        if (win.API_1484_11) {									//SCORM 2004-specific API.

            scorm.version = "2004"; 							//Set version
            API = win.API_1484_11;

        } else if (win.API) {										//SCORM 1.2-specific API
            scorm.version = "1.2"; 							//Set version
            API = win.API;

        }

    }

    if (API) {

        trace(traceMsgPrefix + ": API found. Version: " + scorm.version);
       

    } else {

        trace(traceMsgPrefix + ": Error finding API. \nFind attempts: " + findAttempts + ". \nFind attempt limit: " + findAttemptLimit);

    }

    return API;

};


// ------------------------------------------------------------------------- //

common.SCORM.API.get = function() {

    var API = null,
		win = window,
		find = common.SCORM.API.find,
		trace = common.UTILS.trace;

    if (win.parent && win.parent != win) {

        API = find(win.parent);

    }

    if (!API && win.top.opener) {

        API = find(win.top.opener);

    }

    if (API) {

        common.SCORM.API.isFound = true;

    } else {

        trace("API.get failed: Can't find the API!");

    }

    return API;

};

// ------------------------------------------------------------------------- //

common.SCORM.API.getHandle = function() {

    var API = common.SCORM.API;

    if (!API.handle && !API.isFound) {

        API.handle = API.get();

    }

    return API.handle;

};



// ------------------------------------------------------------------------- //
// --- common.SCORM.connection functions --------------------------------- //
// ------------------------------------------------------------------------- //


common.SCORM.connection.initialize = function() {

    var success = false,
		scorm = common.SCORM,
		completionStatus = common.SCORM.data.completionStatus,
		trace = common.UTILS.trace,
		makeBoolean = common.UTILS.StringToBoolean,
		debug = common.SCORM.debug,
		traceMsgPrefix = "SCORM.connection.initialize ";


    if (!scorm.connection.isActive) {

        var API = scorm.API.getHandle(),
            errorCode = 0;

        if (API) {
            switch (scorm.version) {
                case "1.2": success = makeBoolean(API.LMSInitialize("")); break;

                case "2004": success = makeBoolean(API.Initialize("")); break;
            }

            if (success) {

                //Double-check that connection is active and working before returning 'true' boolean
                errorCode = debug.getCode();


                if (errorCode !== null && errorCode === 0) {

                    scorm.connection.isActive = true;

                    if (scorm.handleCompletionStatus) {

                        //Automatically set new launches to incomplete 
                        completionStatus = common.SCORM.status("get");

                        if (completionStatus) {

                            switch (completionStatus) {

                                //Both SCORM 1.2 and 2004   
                                case "not attempted": common.SCORM.status("set", "incomplete"); break;

                                //SCORM 2004 only   
                                case "unknown": common.SCORM.status("set", "incomplete"); break;

                                //Additional options, presented here in case you'd like to use them   
                                case "completed": common.SCORM.status("set", "completed"); break;
                                case "incomplete": common.SCORM.status("set", "incomplete"); break;
                                case "passed": common.SCORM.status("set", "passed"); break; //SCORM 1.2 only
                                case "failed": common.SCORM.status("set", "failed"); break; //SCORM 1.2 only
                                case "browsed": common.SCORM.status("set", "browsed"); break; //SCORM 1.2 only
                            }

                        }

                    }

                } else {

                    success = false;
                    trace(traceMsgPrefix + "failed. \nError code: " + errorCode + " \nError info: " + debug.getInfo(errorCode));

                }

            } else {

                errorCode = debug.getCode();

                if (errorCode !== null && errorCode !== 0) {

                    trace(traceMsgPrefix + "failed. \nError code: " + errorCode + " \nError info: " + debug.getInfo(errorCode));

                } else {

                    trace(traceMsgPrefix + "failed: No response from server.");

                }
            }

        } else {

            trace(traceMsgPrefix + "failed: API is null.");

        }

    } else {

        trace(traceMsgPrefix + "aborted: Connection already active.");

    }

    return success;

};




// ------------------------------------------------------------------------- //

common.SCORM.connection.terminate = function() {

    var success = false,
		scorm = common.SCORM,
		exitStatus = common.SCORM.data.exitStatus,
		completionStatus = common.SCORM.data.completionStatus,
		trace = common.UTILS.trace,
		makeBoolean = common.UTILS.StringToBoolean,
		debug = common.SCORM.debug,
		traceMsgPrefix = "SCORM.connection.terminate ";


    if (scorm.connection.isActive) {

        var API = scorm.API.getHandle(),
            errorCode = 0;


        if (API) {

            switch (scorm.version) {
                case "1.2": success = makeBoolean(API.LMSFinish("")); common.SCORM.data.___alert("API.LMSFinish()", String(success)); break;
                case "2004": success = makeBoolean(API.Terminate("")); common.SCORM.data.___alert("API.Terminate()", String(success)); break;
            }

            if (success) {

                scorm.connection.isActive = false;
                NoPrompt()

            } else {

                errorCode = debug.getCode();
                trace(traceMsgPrefix + "failed. \nError code: " + errorCode + " \nError info: " + debug.getInfo(errorCode));

            }

        } else {

            trace(traceMsgPrefix + "failed: API is null.");

        }

    } else {

        trace(traceMsgPrefix + "aborted: Connection already terminated.");

    }

    return success;

};



// -------------------------------------------------------------------------- //
// --- common.SCORM.data functions ------------------------------------------ //
// -------------------------------------------------------------------------- //


common.SCORM.data.get = function(parameter) {

    var value = null,
		scorm = common.SCORM,
		trace = common.UTILS.trace,
		debug = common.SCORM.debug,
		traceMsgPrefix = "SCORM.data.get(" + parameter + ") ";

    if (scorm.connection.isActive) {

        var API = scorm.API.getHandle(),
            errorCode = 0;

        if (API) {

            var s = ""
            switch (scorm.version) {

                case "1.2": value = API.LMSGetValue(parameter); s = '"' + parameter + '"'; setTimeout("common.SCORM.data.___alert('API.lmsGetValue(" + s + ")'" + ",'" + value + "')", 0); break;
                case "2004": value = API.GetValue(parameter); s = '"' + parameter + '"'; setTimeout("common.SCORM.data.___alert('API.GetValue(" + s + ")'" + ",'" + value + "')", 0); break;
            }

            errorCode = debug.getCode();

            //GetValue returns an empty string on errors
            //Double-check errorCode to make sure empty string
            //is really an error and not field value
            if (value !== "" && errorCode === 0) {

                switch (parameter) {

                    case "cmi.core.lesson_status": break;
                    case "cmi.completion_status": scorm.data.completionStatus = value; break;

                    case "cmi.core.exit": break;
                    case "cmi.exit": scorm.data.exitStatus = value; break;

                }

            } else {

                trace(traceMsgPrefix + "failed. \nError code: " + errorCode + "\nError info: " + debug.getInfo(errorCode));

            }

        } else {

            trace(traceMsgPrefix + "failed: API is null.");

        }

    } else {

        trace(traceMsgPrefix + "failed: API connection is inactive.");

    }

    trace(traceMsgPrefix + " value: " + value);
    return String(value);

};





// ------------------------------------------------------------------------- //
common.SCORM.data.set = function(parameter, value) {
    var scorm = common.SCORM;
    var trace = common.UTILS.trace;
    var API = scorm.API.getHandle();
    var success = false;
    var makeBoolean = common.UTILS.StringToBoolean;
    var debug = common.SCORM.debug;
    var traceMsgPrefix = "SCORM.data.set(" + parameter + ") ";

    switch (scorm.version) {
        case "1.2": success = makeBoolean(API.LMSSetValue(parameter, value)); common.SCORM.data.___alert("API.LMSSetValue('" + parameter + "'," + value + ")", String(success)); break;
        case "2004": success = makeBoolean(API.SetValue(parameter, value)); common.SCORM.data.___alert("API.SetValue('" + parameter + "'," + value + ")", String(success)); break;
    }

    if (success) {
        if (parameter === "cmi.core.lesson_status" || parameter === "cmi.completion_status") {
            scorm.data.completionStatus = value;
        }
    }
    else {
        trace(traceMsgPrefix + "failed. \nError code: " + errorCode + ". \nError info: " + debug.getInfo(errorCode));
    }

};


// ------------------------------------------------------------------------- //
common.SCORM.data.update = function (parameter) {
    s = '"' + parameter + '"';
    setTimeout('common.SCORM.data.__update(' + s + ')', 0);
}

// ------------------------------------------------------------------------- //
common.SCORM.data.saveAndQuit = function(parameter) {
    s = '"' + parameter + '"';
    setTimeout('common.SCORM.data.__saveAndQuit(' + s + ')',0);
}
// ------------------------------------------------------------------------- //
common.SCORM.data.__saveAndQuit = function(parameter) {

    common.SCORM.data.__update(parameter);
    common.SCORM.data.save();

}

// ------------------------------------------------------------------------- //
common.SCORM.data.__update = function (parameter) {
    var arr = new Array();
    arr = parameter.split("^*^")

    var scoreName = arr[0];
    var scoreValue = arr[1];

    common.SCORM.data.set(scoreName, scoreValue);

    var locationName = arr[2];
    var locationValue = arr[3];
    common.SCORM.data.set(locationName, locationValue);


    var sessionTimeName = arr[4];
    var sessionTimeValue = arr[5];
    common.SCORM.data.set(sessionTimeName, sessionTimeValue);

    var coreLessonName = arr[6];
    var coreLessonValue = arr[7];
    common.SCORM.data.set(coreLessonName, coreLessonValue);

    var completionStatusName = arr[8];
    var completionStatusValue = arr[9];

    common.SCORM.data.set(completionStatusName, completionStatusValue);


    if (common.SCORM.version == '2004') {
        var successStatusName = arr[10];
        var successStatusValue = arr[11];
        common.SCORM.data.set(successStatusName, successStatusValue);
    }

}

// ------------------------------------------------------------------------- //

common.SCORM.data.__exit = function() {
    var success = false,
		scorm = common.SCORM,
		exitStatus = common.SCORM.data.exitStatus,
		completionStatus = common.SCORM.data.completionStatus,
		trace = common.UTILS.trace,
		makeBoolean = common.UTILS.StringToBoolean,
		debug = common.SCORM.debug,
		traceMsgPrefix = "common.SCORM.data.__exit ";
    if (scorm.connection.isActive) {
        var API = scorm.API.getHandle(),
            errorCode = 0;
        if (API) {
            if (scorm.handleExitMode && (!exitStatus)) {

                if (completionStatus !== "completed" && completionStatus !== "passed") {

                    switch (scorm.version) {
                        case "1.2": success = scorm.set("cmi.core.exit", "suspend"); break;
                        case "2004": success = scorm.set("cmi.exit", "suspend"); break;
                    }
                } else {

                    switch (scorm.version) {
                        case "1.2": success = scorm.set("cmi.core.exit", "logout"); break;
                        case "2004": success = scorm.set("cmi.exit", "normal"); break;
                    }
                }
            }
            if (!success) {

                errorCode = debug.getCode();
                trace(traceMsgPrefix + "failed. \nError code: " + errorCode + " \nError info: " + debug.getInfo(errorCode));
            }
        } else {
            trace(traceMsgPrefix + "failed: API is null.");
        }
    } else {

        trace(traceMsgPrefix + "aborted: Connection already terminated.");
    }
    return success;
};




// ------------------------------------------------------------------------- //

common.SCORM.data.save = function() {

    var success = false,
		scorm = common.SCORM,
		trace = common.UTILS.trace,
		makeBoolean = common.UTILS.StringToBoolean,
		traceMsgPrefix = "SCORM.data.save failed";


    if (scorm.connection.isActive) {

        var API = scorm.API.getHandle();

        if (API) {
            success = common.SCORM.data.__exit();
            success = common.SCORM.data.___commit();

        } else {

            trace(traceMsgPrefix + ": API is null.");

        }

    } else {

        trace(traceMsgPrefix + ": API connection is inactive.");
    }
    return success;

};


// ------------------------------------------------------------------------- //

common.SCORM.data.___commit = function() {
    var success = "false";
    var scorm = common.SCORM;
    var trace = common.UTILS.trace;
    var makeBoolean = common.UTILS.StringToBoolean;
    var traceMsgPrefix = "SCORM.data.save failed";
    var API = common.SCORM.API.getHandle();
    switch (scorm.version) {
        case "1.2": success = API.LMSCommit(""); setTimeout("common.SCORM.data.___alert('API.LMSCommit()'" + ",'" + success + "')", 0); common.SCORM.connection.terminate(); break;
        case "2004": success = API.Commit(""); setTimeout("common.SCORM.data.___alert('API.Commit()'" + ",'" + success + "')", 0); common.SCORM.connection.terminate(); break;
    }
    return makeBoolean(success)
}




// ------------------------------------------------------------------------- //
common.SCORM.data.___alert = function(parameter, value) {
    if (common.debug.isActive) {
        alert(parameter + ", result=" + value)
    }
}




// ------------------------------------------------------------------------- //
common.SCORM.status = function(action, status) {

    var success = false,
		scorm = common.SCORM,
		trace = common.UTILS.trace,
		traceMsgPrefix = "SCORM.getStatus failed",
		cmi = "";

    if (action !== null) {

        switch (scorm.version) {
            case "1.2": cmi = "cmi.core.lesson_status"; break;
            case "2004": cmi = "cmi.completion_status"; break;
        }

        switch (action) {

            case "get": success = common.SCORM.data.get(cmi); break;

            case "set": if (status !== null) {

                    success = common.SCORM.data.set(cmi, status);

                } else {

                    success = false;
                    trace(traceMsgPrefix + ": status was not specified.");

                }

                break;

            default: success = false;
                trace(traceMsgPrefix + ": no valid action was specified.");

        }

    } else {

        trace(traceMsgPrefix + ": action was not specified.");

    }

    return success;

};


// ------------------------------------------------------------------------- //
// --- common.SCORM.debug functions -------------------------------------- //
// ------------------------------------------------------------------------- //


/* -------------------------------------------------------------------------
common.SCORM.debug.getCode
Requests the error code for the current error state from the LMS

Parameters: None
Returns:    Integer (the last error code).
---------------------------------------------------------------------------- */

common.SCORM.debug.getCode = function() {

    var API = common.SCORM.API.getHandle(),
		scorm = common.SCORM,
		trace = common.UTILS.trace,
        code = 0;

    if (API) {

        switch (scorm.version) {
            case "1.2": code = parseInt(API.LMSGetLastError(), 10); break;
            case "2004": code = parseInt(API.GetLastError(), 10); break;
        }

    } else {

        trace("SCORM.debug.getCode failed: API is null.");

    }

    return code;

};


// ------------------------------------------------------------------------- //

common.SCORM.debug.getInfo = function(errorCode) {

    var API = common.SCORM.API.getHandle(),
		scorm = common.SCORM,
		trace = common.UTILS.trace,
        result = "";


    if (API) {

        switch (scorm.version) {
            case "1.2": result = API.LMSGetErrorString(errorCode.toString()); break;
            case "2004": result = API.GetErrorString(errorCode.toString()); break;
        }

    } else {

        trace("SCORM.debug.getInfo failed: API is null.");

    }

    return String(result);

};


// ------------------------------------------------------------------------- //

common.SCORM.debug.getDiagnosticInfo = function(errorCode) {

    var API = common.SCORM.API.getHandle(),
		scorm = common.SCORM,
		trace = common.UTILS.trace,
        result = "";

    if (API) {

        switch (scorm.version) {
            case "1.2": result = API.LMSGetDiagnostic(errorCode); break;
            case "2004": result = API.GetDiagnostic(errorCode); break;
        }

    } else {

        trace("SCORM.debug.getDiagnosticInfo failed: API is null.");

    }

    return String(result);

};


// ------------------------------------------------------------------------- //
// --- Shortcuts! ---------------------------------------------------------- //
// ------------------------------------------------------------------------- //

common.SCORM.init = common.SCORM.connection.initialize;
common.SCORM.get = common.SCORM.data.get;
common.SCORM.set = common.SCORM.data.set;
common.SCORM.save = common.SCORM.data.save;
common.SCORM.quit = common.SCORM.connection.terminate;



// ------------------------------------------------------------------------- //
// --- common.UTILS functions ---------------------------------------------- //
// ------------------------------------------------------------------------- //

common.UTILS.StringToBoolean = function(string) {
    switch (string.toLowerCase()) {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
};



// ------------------------------------------------------------------------- //
common.UTILS.trace = function(msg) {

    if (common.debug.isActive) {

        //Firefox users can use the 'Firebug' extension's console.
        if (window.console && window.console.firebug) {
            console.log(msg);
        } else {
            alert(msg);
        }
    }

};

