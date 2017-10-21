// good returns
export const var_declare = 
  [{"lineNumber": 1,
    "dataArray": [ 
     {"name" : "a",
      "value" : "undefined"} 
    ],
   "consoleOutput":"",
	 "consoleVariable":false,
	 "variableValue":false,
	 "unsupported":false 
  }]

export const assign_num = 
  [{"lineNumber": 1,
    "dataArray": [
      {"name" : "a",
       "value" : "2"}
    ],
   "consoleOutput":"",
	 "consoleVariable":false,
	 "variableValue":false,
	 "unsupported":false 
  }]

export const dec_then_assign = 
  [{"lineNumber": 1,
    "dataArray": [
      {"name" : "a",
       "value" : "undefined"}
    ],
   "consoleOutput":"",
	 "consoleVariable":false,
	 "variableValue":false,
	 "unsupported":false 
  },
   {"lineNumber": 2,
    "dataArray": [
      {"name" : "a",
       "value" : "2"}
    ],
   "consoleOutput":"",
	 "consoleVariable":false,
	 "variableValue":false,
	 "unsupported":false 
  }]

export const assign_str = 
  {"lineNumber": 2,
    "dataArray": [
      {"name" : "a",
       "value" : "'hello'"}
    ],
    "consoleOutput": "",
	  "consoleVariable":false,
	  "variableValue":false,
    "unsupported":false
  }

export const assign_b_to_a = 
  {"lineNumber": 3,
    "dataArray": [
      {"name" : "a",
       "value" : "b"} 
    ],
    "consoleOutput": "",
	  "consoleVariable":false,
	  "variableValue":true,
    "unsupported":false
  }
