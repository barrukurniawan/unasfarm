function StrengthPassword(passwd)
{
		var intScore   = 0
		var strVerdict = "Password Strength Level"
		var BadPassword=new Array("asdfg1234","2222222222222222","8888888888888888","aaaaa11111","asdf1234","abcd1111","abcd2222","1111111111111111","11111111111111111","111111111111111111","1111111111111111111","11111111111111111111","1111111111111111111111111","aaaa1111","1111aaaa","abc12345","abc12346","abcd1234","abcd12345","abcd123456","abcde123","abcde1234","abcdef12","abcde12345","abcdef123456","12345abc","1234abcd","123abcde","123abcdef","1234abcde","12345abcdef");	

		// PASSWORD LENGTH
		if (passwd.length<5)                         // length 4 or less
		{
			intScore = (intScore+3)
		}
		else if (passwd.length>4 && passwd.length<8) // length between 5 and 7
		{
			intScore = (intScore+6)
		}
		else if (passwd.length>7 && passwd.length<16)// length between 8 and 15
		{
			intScore = (intScore+12)
		}
		else if (passwd.length>15)                    // length 16 or more
		{
			intScore = (intScore+18)
		}
		
		
		// LETTERS (Not exactly implemented as dictacted above because of my limited understanding of Regex)
		if (passwd.match(/[a-z]/))                              // [verified] at least one lower case letter
		{
			intScore = (intScore+1)
		}
		
		if (passwd.match(/[A-Z]/))                              // [verified] at least one upper case letter
		{
			intScore = (intScore+5)
		}
		
		// NUMBERS
		if (passwd.match(/\d+/))                                 // [verified] at least one number
		{
			intScore = (intScore+5)
		}
		
		if (passwd.match(/(.*[0-9].*[0-9].*[0-9])/))             // [verified] at least three numbers
		{
			intScore = (intScore+5)
		}
		
		
		// SPECIAL CHAR
		if (passwd.match(/.[!,@,#,$,%,^,&,*,?,_,~]/))            // [verified] at least one special character
		{
			intScore = (intScore+5)
		}
		
									 // [verified] at least two special characters
		if (passwd.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/))
		{
			intScore = (intScore+5)
		}
	
		
		// COMBOS
		if (passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))        // [verified] both upper and lower case
		{
			intScore = (intScore+2)
		}

		if (passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/)) // [verified] both letters and numbers
		{
			intScore = (intScore+2)
		}
 
									// [verified] letters, numbers, and special characters
		if (passwd.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/))
		{
			intScore = (intScore+2);
		}
	
	
		if(intScore < 16)
		{  document.getElementById("passwordmeter").style.backgroundColor ="#FFC000";
		   strVerdict = "Very weak";		   
		}
		else if (intScore > 15 && intScore < 25)
		{
		   strVerdict = "Weak";
		   document.getElementById("passwordmeter").style.backgroundColor ="#FFDE00";
		}
		else if (intScore > 24 && intScore < 35)
		{
		   strVerdict = "Medium";
		   document.getElementById("passwordmeter").style.backgroundColor ="#D8FF00";
		}
		else if (intScore > 34 && intScore < 45)
		{
		   strVerdict = "Strong";
		   document.getElementById("passwordmeter").style.backgroundColor ="#4EFF00";
		}
		else
		{
		   strVerdict = "Very strong";
		   document.getElementById("passwordmeter").style.backgroundColor ="#00FFD8";
		   
		}
		if(intScore>24 && passwd.length>7) {
			document.getElementById("pwerror").innerHTML  = "";
		}
		
		for(i=0; i<BadPassword.length;i++){
			if(BadPassword[i]==passwd.toLowerCase()){
				strVerdict = "Weak";
				document.getElementById("passwordmeter").style.backgroundColor ="#FFDE00";	
			}
		}

	document.getElementById("passwordmeter").innerHTML  = strVerdict;
	
	if (strVerdict == "Weak" || strVerdict == "Very weak") {
		return false;
	}
	
	return true;		
}