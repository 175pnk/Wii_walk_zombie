
var wiimote: Transform;
static var whichRemote: int;

var buttonA : MeshRenderer;
var buttonB : MeshRenderer;

var buttonUp : MeshRenderer;
var buttonDown : MeshRenderer;
var buttonLeft : MeshRenderer;
var buttonRight : MeshRenderer;

var buttonMinus : MeshRenderer;
var buttonPlus : MeshRenderer;
var buttonHome : MeshRenderer;

var buttonOne : MeshRenderer;
var buttonTwo : MeshRenderer;


var buttonClassicA : MeshRenderer;
var buttonClassicB : MeshRenderer;
var buttonClassicMinus : MeshRenderer;
var buttonClassicPlus : MeshRenderer;
var buttonClassicHome : MeshRenderer;
var buttonClassicX : MeshRenderer;
var buttonClassicY : MeshRenderer;
var buttonClassicUp : MeshRenderer;
var buttonClassicDown : MeshRenderer;
var buttonClassicLeft : MeshRenderer;
var buttonClassicRight : MeshRenderer;
    
var classic : Transform;
var classicStickLeft : Transform;
var classicStickRight : Transform;
    
var buttonClassicL : MeshRenderer;
var buttonClassicR : MeshRenderer;
    
var buttonClassicZL : MeshRenderer;
var buttonClassicZR : MeshRenderer;

var motionPlus:    Transform;

var theIRMain: GUITexture;
var theIR1:    GUITexture;
var theIR2:    GUITexture;
var theIR3:    GUITexture;
var theIR4:    GUITexture;

var balanceBoard       : Transform;
var balanceTopLeft     : Transform;
var balanceTopRight    : Transform;
var balanceBottomLeft  : Transform;
var balanceBottomRight : Transform;


//private var searching = false;
var theText : GUIText;
var theRemoteNumber: GUIText;
var WiiObject: GameObject;
var Wii;

Wii = WiiObject.GetComponent("Wii");

function setVisibility(t : Transform , v : boolean)
{
	if (t.GetComponent.<Renderer>() && t.GetComponent.<Renderer>().enabled != v) 
	{
		t.GetComponent.<Renderer>().enabled = v;
	}
	renderers = t.GetComponentsInChildren (Renderer);
		for (var rendy : Renderer in renderers) {
    		rendy.enabled = v;
		}
}

function Start () {
	theText.text = "Ready.";
	setVisibility(wiimote,false);
	setVisibility(classic,false);
	setVisibility(balanceBoard,false);
}
 var totalRemotes = 0;
function OnGUI () {
	totalRemotes = Wii.GetRemoteCount();
	
	theRemoteNumber.text = "Remote on Display:"+(whichRemote+1).ToString();
	
	for(var x=0;x<16;x++)
	{
		if(Wii.IsActive(x))
		{
			if (GUI.Button (Rect ((x*70),0, 70, 50), ("remote "+(x+1)) )) 
			{
				whichRemote = x;
				if(!Wii.IsActive(whichRemote))
				{
					if(Wii.IsSearching())
						theText.text = ("I'm looking.");
					else
						theText.text = ("remote "+whichRemote+" is not active.");
				}
			}
		}
	}
	
	if (Wii.IsActive(whichRemote))
	{
		if(GUI.Button (Rect (150,50, 50, 30), "drop")) {
			Wii.DropWiiRemote(whichRemote);   
			theText.text = ("Dropped "+whichRemote);
		}

		if(Wii.HasMotionPlus(whichRemote))
		{
			if(GUI.Button (Rect (170,80, 160, 30), "Deactivate Motion Plus")) 
			{
				Wii.DeactivateMotionPlus(whichRemote);
			}
			if(Wii.IsMotionPlusCalibrated(whichRemote))
			{
				if(GUI.Button (Rect (190,110, 180, 30), "Uncalibrate Motion Plus")) 
				{
					Wii.UncalibrateMotionPlus(whichRemote);
				}
			}
			else
			{
				if(GUI.Button (Rect (190,110, 160, 30), "Calibrate Motion Plus")) 
				{
					Wii.CalibrateMotionPlus(whichRemote);
				}
			}   
		}
		else
		{
			if(GUI.Button (Rect (170,80, 160, 30), "Check For Motion Plus")) 
			{
				Wii.CheckForMotionPlus(whichRemote);
			}
		}
	}
	
	if(Wii.IsSearching())
	{
		if (GUI.Button (Rect (0,60, 128, 58), "Cancel")) {
			//searching = false;
			Wii.StopSearch();   
			theText.text = "Cancelled.";
		}	
	}
	else
	{
		if (!Wii.IsSearching() && (totalRemotes<16) && GUI.Button (Rect (0,50, 128, 58), "Find")) {
			searching = true;
			Wii.StartSearch();   
			theText.text = "I'm looking.";
			Time.timeScale = 1.0;
		}
	}	
}

function OnDiscoveryError(i : int) {
	theText.text = "Error:"+i+". Try Again.";
	//searching = false;
}

function OnWiimoteFound (thisRemote: int) {
	Debug.Log("found this one: "+thisRemote);
	if(!Wii.IsActive(whichRemote))
		whichRemote = thisRemote;
}

function OnWiimoteDisconnected (whichRemote: int) {
	Debug.Log("lost this one: "+ whichRemote);	
}

function Update () {

	if(Wii.IsActive(whichRemote))
	{		
		theRemoteNumber.enabled=true;
		var inputDisplay = "";
		inputDisplay = inputDisplay + "Remote #"+whichRemote.ToString();
		inputDisplay = inputDisplay + "\nbattery "+Wii.GetBattery(whichRemote).ToString();
		
		if(Wii.GetExpType(whichRemote)==3)//balance board is in is in
		{
			setVisibility(balanceBoard,true);
			setVisibility(wiimote,false);
			var theBalanceBoard = Wii.GetBalanceBoard(whichRemote); 
			var theCenter = Wii.GetCenterOfBalance(whichRemote);
			//Debug.Log(theBalanceBoard+" "+theCenter);
			balanceTopLeft.localScale.y     = 1-(.01*theBalanceBoard.y); 
			balanceTopRight.localScale.y    = 1-(.01*theBalanceBoard.x);
			balanceBottomLeft.localScale.y  = 1-(.01*theBalanceBoard.w);
			balanceBottomRight.localScale.y = 1-(.01*theBalanceBoard.z);

			theIR1.pixelInset = Rect(Screen.width/2-(Screen.width/4),Screen.height/2+(Screen.height/4),10.0,10.0);
			theIR2.pixelInset = Rect(Screen.width/2+(Screen.width/4),Screen.height/2+(Screen.height/4),10.0,10.0);
			theIR3.pixelInset = Rect(Screen.width/2-(Screen.width/4),Screen.height/2-(Screen.height/4),10.0,10.0);
			theIR4.pixelInset = Rect(Screen.width/2+(Screen.width/4),Screen.height/2-(Screen.height/4),10.0,10.0);
			theIR1.pixelInset.x -=theIR1.pixelInset.width/2;
			theIR1.pixelInset.y -=theIR1.pixelInset.height/2;
			theIR2.pixelInset.x -=theIR2.pixelInset.width/2;
			theIR2.pixelInset.y -=theIR2.pixelInset.height/2;
			theIR3.pixelInset.x -=theIR3.pixelInset.width/2;
			theIR3.pixelInset.y -=theIR3.pixelInset.height/2;
			theIR4.pixelInset.x -=theIR4.pixelInset.width/2;
			theIR4.pixelInset.y -=theIR4.pixelInset.height/2;			
			theIRMain.pixelInset = Rect((Screen.width/2)+(theCenter.x*(Screen.width/4)),(Screen.height/2)+(theCenter.y*Screen.height/4),50.0,50.0);
			//theIRMain.pixelInset = Rect(50.0,50.0,50.0,50.0);
			theIRMain.pixelInset.x -=theIRMain.pixelInset.width/2;
			theIRMain.pixelInset.y -=theIRMain.pixelInset.height/2;
			
			inputDisplay = inputDisplay + "\nBALANCE BOARD";
			inputDisplay = inputDisplay + "\ntotal Weight "+Wii.GetTotalWeight(whichRemote)+"kg";
			inputDisplay = inputDisplay + "\ntopRight     "+theBalanceBoard.x+"kg";
			inputDisplay = inputDisplay + "\ntopLeft      "+theBalanceBoard.y+"kg";
			inputDisplay = inputDisplay + "\nbottomRight  "+theBalanceBoard.z+"kg";
			inputDisplay = inputDisplay + "\nbottomLeft   "+theBalanceBoard.w+"kg";
		}
		else
		{
			///WIIREMOTE
			setVisibility(wiimote,true);
			pointerArray = Wii.GetRawIRData(whichRemote);		
			mainPointer = Wii.GetIRPosition(whichRemote);
			wiiAccel = Wii.GetWiimoteAcceleration(whichRemote);
			
			theIRMain.pixelInset = Rect(mainPointer.x*Screen.width-25.0f,mainPointer.y*Screen.height-25.0f,50.0,50.0);
			var sizeScale = 5.0f;
			
			theIR1.pixelInset = Rect (pointerArray[0].x*Screen.width-(pointerArray[0].z*sizeScale/2.0f),
			 							pointerArray[0].y*Screen.height-(pointerArray[0].z*sizeScale/2.0f),
			 							pointerArray[0].z*sizeScale*10, pointerArray[0].z*sizeScale*10);
			 							
			theIR2.pixelInset = Rect (pointerArray[1].x*Screen.width-(pointerArray[1].z*sizeScale/2.0f),
										pointerArray[1].y*Screen.height-(pointerArray[1].z*sizeScale/2.0f),
										pointerArray[1].z*sizeScale*10, pointerArray[1].z*sizeScale*10);
										
			theIR3.pixelInset = Rect (pointerArray[2].x*Screen.width-(pointerArray[2].z*sizeScale/2.0f),
										pointerArray[2].y*Screen.height-(pointerArray[2].z*sizeScale/2.0f),
										pointerArray[2].z*sizeScale*10, pointerArray[2].z*sizeScale*10);
										
			theIR4.pixelInset = Rect (pointerArray[3].x*Screen.width-(pointerArray[3].z*sizeScale/2.0f),
										pointerArray[3].y*Screen.height-(pointerArray[3].z*sizeScale/2.0f),
										pointerArray[3].z*sizeScale*10, pointerArray[3].z*sizeScale*10);
		
			wiimote.localRotation = Quaternion.Slerp(transform.localRotation,
				Quaternion.Euler(wiiAccel.y*90.0, 0.0,wiiAccel.x*-90.0),5.0);
				
			if(Wii.GetButton(whichRemote, "A"))
				buttonA.enabled = true;
			else
				buttonA.enabled = false;
			if(Wii.GetButton(whichRemote, "B"))
				buttonB.enabled = true;
			else
				buttonB.enabled = false;
			if(Wii.GetButton(whichRemote, "UP"))
				buttonUp.enabled = true;
			else
				buttonUp.enabled = false;
			if(Wii.GetButton(whichRemote, "DOWN"))
				buttonDown.enabled = true;
			else
				buttonDown.enabled = false;
			if(Wii.GetButton(whichRemote, "LEFT"))
				buttonLeft.enabled = true;
			else
				buttonLeft.enabled = false;
			if(Wii.GetButton(whichRemote, "RIGHT"))
				buttonRight.enabled = true;
			else
				buttonRight.enabled = false;
			if(Wii.GetButton(whichRemote, "MINUS"))
				buttonMinus.enabled = true;
			else
				buttonMinus.enabled = false;
			if(Wii.GetButton(whichRemote, "PLUS"))
				buttonPlus.enabled = true;
			else
				buttonPlus.enabled = false;
			if(Wii.GetButton(whichRemote, "HOME"))
				buttonHome.enabled = true;
			else
				buttonHome.enabled = false;
			if(Wii.GetButton(whichRemote, "ONE"))
				buttonOne.enabled = true;
			else
				buttonOne.enabled = false;		
			if(Wii.GetButton(whichRemote, "TWO"))
				buttonTwo.enabled = true;
			else
				buttonTwo.enabled = false;
				
			inputDisplay = inputDisplay + "\nIR      "+Wii.GetIRPosition(whichRemote).ToString("#.0000");
			inputDisplay = inputDisplay + "\nIR rot  "+Wii.GetIRRotation(whichRemote).ToString();
			inputDisplay = inputDisplay + "\nA       "+Wii.GetButton(whichRemote,"A").ToString();
			inputDisplay = inputDisplay + "\nB       "+Wii.GetButton(whichRemote,"B").ToString();
			inputDisplay = inputDisplay + "\n1       "+Wii.GetButton(whichRemote,"1").ToString();
			inputDisplay = inputDisplay + "\n2       "+Wii.GetButton(whichRemote,"2").ToString();
			inputDisplay = inputDisplay + "\nUp      "+Wii.GetButton(whichRemote,"UP").ToString();
			inputDisplay = inputDisplay + "\nDown    "+Wii.GetButton(whichRemote,"DOWN").ToString();
			inputDisplay = inputDisplay + "\nLeft    "+Wii.GetButton(whichRemote,"LEFT").ToString();
			inputDisplay = inputDisplay + "\nRight   "+Wii.GetButton(whichRemote,"RIGHT").ToString();
			inputDisplay = inputDisplay + "\n-       "+Wii.GetButton(whichRemote,"-").ToString();
			inputDisplay = inputDisplay + "\n+       "+Wii.GetButton(whichRemote,"+").ToString();
			inputDisplay = inputDisplay + "\nHome    "+Wii.GetButton(whichRemote,"HOME").ToString();
			inputDisplay = inputDisplay + "\nAccel   "+Wii.GetWiimoteAcceleration(whichRemote).ToString("#.0000");
			
			if(Wii.HasMotionPlus(whichRemote))
			{
				setVisibility(motionPlus,true);
				motion = Wii.GetMotionPlus(whichRemote);
				if(Input.GetKeyDown("space") || Wii.GetButtonDown(whichRemote,"HOME"))
				{
					motionPlus.localRotation = Quaternion.identity;
				}
				motionPlus.RotateAround(motionPlus.position,motionPlus.right,motion.x);
				motionPlus.RotateAround(motionPlus.position,motionPlus.up,-motion.y);
				motionPlus.RotateAround(motionPlus.position,motionPlus.forward,motion.z);
				
				inputDisplay = inputDisplay + "\nMotion+ "+motion.ToString("#.0000");
				inputDisplay = inputDisplay + "\nYAW FAST "+Wii.IsYawFast(whichRemote);
				inputDisplay = inputDisplay + "\nROLL FAST "+Wii.IsRollFast(whichRemote);
				inputDisplay = inputDisplay + "\nPITCH FAST "+Wii.IsPitchFast(whichRemote);				

			}
			else
			{
				setVisibility(motionPlus,false);
			}
			
		theText.text=inputDisplay;		
	}
	
	{
		setVisibility(wiimote,false);
		setVisibility(balanceBoard,false);
		setVisibility(classic,false);
		theRemoteNumber.enabled=false;
		theText.text = "Ready.";
	}
}
}