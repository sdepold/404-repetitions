export default {
    "host": "",
    "name": "home",
    "items": [
      {
        "title": "Dress up",
        "requirements": {
          "dressed": false,
          "time": 10
        },
        "effects": {
          "dressed": true
        },
        "soundEffect": [,,528,.01,,.48,,.6,-11.6,,,,.32,4.2],
        "hideIfRequirementsNotMet": true
      },
      {
        "title": "Thorough sleep",
        "requirements": {
          "time": 480
        },
        "effects": {
          "stamina": 100
        }
      }, 
      {
          "title": "Quick nap",
          "requirements": {
            "time": 120
          },
          "effects": {
            "stamina": 50
          }
      }
    ]
  }
  