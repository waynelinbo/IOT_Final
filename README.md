IOT Final - Security Enhancement
==========

## Feature
1. Information Leak Defense
   - Problem : When use http, the packet content will be leaked
      <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/56d22cd3-fe43-4452-9422-5a3100047dbb" width="80%" alt="XXX" align=center />
   - Solution : Enable HTTPS to encrypt packet content
3. Brute Attack Defense
   - Problem : Attacker can guess the password endlessly until cracks it
   - Solution : Block user after 5 failed login attempts

## Initialization
1. Clone this project
2. Re-build the project
   ```sh
   $ mvn clean install -DskipTests=true
   ```
3. Install wireshark and start wireshark
   ```sh
   # Install wireshark
   $ sudo apt install wireshark

   # Start wireshark
   $ sudo wireshark
   ```

## Information Leak Defense : Enable HTTPS to encrypt packet content
### Step 1 : Generate a self-signed certificate using java keytools
1. Create a folder to place generated certicates and enter the folder
   ```sh
   $ mkdir ~/.SSLCA
   $ cd ~/.SSLCA
   ```
2. Generate a self-signed certificate for in-cse
   * Set password to '000000'
   ```sh
   $ keytool -genkey -dname "CN=127.0.0.1" -alias INCSE -keystore .keystore_incse -keyalg RSA -keysize 1024
   ```
3. Generate a self-signed certificate for mn-cse
   * Set password to '000000'
   ```sh
   $ keytool -genkey -dname "CN=127.0.0.1" -alias MNCSE -keystore .keystore_mncse -keyalg RSA -keysize 1024
   ```
 
4. The result will like below <br>
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/80183ffa-ff96-4ebf-bc43-309e3c79f1aa" width="50%" alt="XXX" align=center />
   
### Step 2 : Modify 'config.ini' of in-cse and mn-cse
1. Append the following code to the bottom of "config.ini" of in-cse
   * Enable HTTPS
   * Set HTTPS port to 8443
   * certificate password : 000000
   * Set the path of certificate : /home/[user_name]/.SSLCA/.keystore_incse
   * Use TLS protocal
   ```c
   org.eclipse.equinox.http.jetty.https.enabled=true
   org.eclipse.equinox.http.jetty.https.port=8443
   org.eclipse.equinox.http.jetty.ssl.password=000000
   org.eclipse.equinox.http.jetty.ssl.keypassword=000000
   org.eclipse.equinox.http.jetty.ssl.keystore=/home/om2m/.SSLCA/.keystore_incse
   org.eclipse.equinox.http.jetty.ssl.protocol=TLS
   ```
   
3. Append the following code to the bottom of "config.ini" of mn-cse
   * Enable HTTPS
   * Set HTTPS port to 8444
   * certificate password : 000000
   * Set the path of certificate : /home/[user_name]/.SSLCA/.keystore_mncse
   * Use TLS protocal
   ```c
   org.eclipse.equinox.http.jetty.https.enabled=true
   org.eclipse.equinox.http.jetty.https.port=8444
   org.eclipse.equinox.http.jetty.ssl.password=000000
   org.eclipse.equinox.http.jetty.ssl.keypassword=000000
   org.eclipse.equinox.http.jetty.ssl.keystore=/home/om2m/.SSLCA/.keystore_mncse
   org.eclipse.equinox.http.jetty.ssl.protocol=TLS
   ```
### Step 3 : Test
1. Start in-cse and mn-cse
   ```sh
   $ sh start.sh
   ```
   
2. Open browser and enter 'https://127.0.0.1:8443/webpage' for in-cse <br>
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/c3914f7c-4614-425e-8d60-2f88e1041762" width="80%" alt="XXX" align=center />
   
3. Open browser and enter 'https://127.0.0.1:8444/webpage' for mn-cse <br>
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/6a7ee6b6-053c-4a6e-a33d-771ca71c0bc3" width="80%" alt="XXX" align=center />
   
4. mn-cse can be linked from in-cse
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/0947a27d-4298-41ec-9680-748ac66ce905" width="80%" alt="XXX" align=center />

5. Use wireshark to check whether the packet is encrypted after enabling https
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/5187844b-3b3c-40a0-b992-02bb68e5932a" width="80%" alt="XXX" align=center />



## Brute Attack Defense : Block user after 5 failed login attempts
Work at `org.eclipse.om2m/org.eclipse.om2m.webapp.resourcesbrowser.json/`
### Step 1 : Add a new block in ‘index.html’ to display fail counts
* Add a `failCount` div in the login page <br>
  <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/ef859c48-fc00-4ab5-a84e-3e4e1fb2672c" width="40%" alt="XXX" align=center />
  
* Result <br>
  <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/69f796c2-2193-432a-9f6f-b3c7ef36819d" width="30%" alt="XXX" align=center />
  
### Step 2 : Modify ‘om2m.js’ to accumulate fail counts and block user when fail counts > 5
```mermaid
graph LR
A[func login] -->B[func get]
    B -->|success| C(enter cse)
    B -->|error| D(print error mesage)
```

1. Declare 3 additional variables and const
   * const tryCountMax : Maximum number of failed login attempts allowed for a user
   * var tryCount : Cumulative number of failed attempts
   * var isBlocked : If true, the user is banned
   <br>
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/ebfa7d1d-1348-45bb-9034-95560b68a8cf" width="40%" alt="XXX" align=center />
   <br>
   
2. Modify `func login`
   * This function is triggered when user try to login
     * It collects the username:password pair and calls "func get" to determine if the pair is legal
   * I use isBlocked to determine if the user has permission to log in
   <br>
   <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/a0b94f2b-7227-42ae-b27e-67ed51e7c2b5" width="40%" alt="XXX" align=center />
   <br>

3. Modify `func get`
   * `func get` has 2 parts (success and error)
     <br>
     <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/5c0c9571-a0a6-4ae1-842f-12c3a12830d3" width="40%" alt="XXX" align=center />
     <br>
     
   * I modify the error part
     * Cumulate the fail count
     * Set isBlocked when fail count >= 5
     * print error message
     <br>
     <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/76771b0e-5277-4a37-848f-6d5d285bed24" width="50%" alt="XXX" align=center />
     <br>
     
### Step 3 : Test
Successfully ban the user with more than 5 failed login attempts
<br>
<img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/001c2ccd-6cd1-41ac-96d3-b224770ddb81" width="60%" alt="XXX" align=center />



   
