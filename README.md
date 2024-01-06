IOT Final - Security Enhancement
==========

## Feature
1. Information Leak Defense
   - Enable HTTPS to encrypt packet content
3. Brute Attack Defense
   - Block user after 5 failed login attempts

## Initialization
1. Clone this project
2. Re-build the project
   ```sh
   $ mvn clean install -DskipTests=true
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

4. mn-cse can be linked from in-cse and vice versa

5. Use wireshark to check whether the packet is encrypted
   * Install and start wireshark
     ```sh
     # Install wireshark
     $ sudo apt install wireshark

     # Start wireshark
     $ sudo wireshark
     ```
   * When use http, the login username and password will be leaked when we login
     <img src="https://github.com/waynelinbo/IOT_Final/assets/39195011/56d22cd3-fe43-4452-9422-5a3100047dbb" width="80%" alt="XXX" align=center />
   * After enabling https, the packet is encrypted
     
   
   

## Brute Attack Defense : Block user after 5 failed login attempts
   
