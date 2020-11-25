import { RequestSystem } from "./system/request/requestSystem";
import { Spider } from "./system/spider/spider";
import { ProxySystem } from "./system/proxy/proxySystem";

export class Test {
    async run() {
        // await this.testErrorsCode();
        // await this.testSSLMethod();
        // await this.testCipher();
        // await this.testSSLProtocol();
        // await new RequestSystem("hackyourselffirst.troyhunt.com", 443).run();
        // await new Spider("hackyourselffirst.troyhunt.com", 443, 6).run();
        // await new Spider("hacking-lab.com", 443, 6).run();
        await new ProxySystem("testphp.vulnweb.com", 7001).run();
    }

    /*
    async testPort() {
        const ports = PortsListenerChecker.getPortsFromInterval(1, 1000);
        const result = await new PortsListenerChecker("localhost", ports).run();
        console.info("Result: " + result);
    }
    */

    /*
    async testErrorsCode() {

        // Tomcat
        var result = await new ServerVersionIdentifier("localhost", 7002).identify();
        console.info("Result tomcat 8: " + result.toString());
        assert(result.serverType == "tomcat");

        result = await new ServerVersionIdentifier("localhost", 7003).identify();
        console.info("Result tomcat 9: " + result);
        assert(result.serverType == "tomcat");

        result = await new ServerVersionIdentifier("localhost", 7004).identify();
        console.info("Result tomcat 10: " + result);
        assert(result.serverType == "tomcat");

        // Apache
        result = await new ServerVersionIdentifier("localhost", 7005).identify();
        console.info("Result apache 2: " + result);
        assert(result.serverType == "apache");

        result = await new ServerVersionIdentifier("localhost", 7006).identify();
        console.info("Result apache 2.4: " + result);
        assert(result.serverType == "apache");

        result = await new ServerVersionIdentifier("localhost", 7007).identify();
        console.info("Result apache 2.4.46: " + result);
        assert(result.serverType == "apache");

        // Nginx
        result = await new ServerVersionIdentifier("localhost", 7008).identify();
        console.info("Result Nginx 1.18: " + result);
        assert(result.serverType == "nginx");

        result = await new ServerVersionIdentifier("localhost", 7009).identify();
        console.info("Result Nginx 1.19: " + result);
        assert(result.serverType == "nginx");

        result = await new ServerVersionIdentifier("localhost", 7010).identify();
        console.info("Result Nginx 1.19.4: " + result);
        assert(result.serverType == "nginx");

        // glassfish
        result = await new ServerVersionIdentifier("localhost", 7013).identify();
        console.info("Result glassfish 4.0: " + result);
        assert(result.serverType == "glassfish");

        result = await new ServerVersionIdentifier("localhost", 7014).identify();
        console.info("Result glassfish 4.1: " + result);
        assert(result.serverType == "glassfish");

        // wildfly
        result = await new ServerVersionIdentifier("localhost", 7015).identify();
        console.info("Result wildfly: " + result);
        assert(result.serverType == "wildfly");

        // Jetty
        result = await new ServerVersionIdentifier("localhost", 7016).identify();
        console.info("Result jetty 9.2: " + result);

        result = await new ServerVersionIdentifier("localhost", 7017).identify();
        console.info("Result jetty 9.3: " + result);
        assert(result.serverType == "jetty");

        result = await new ServerVersionIdentifier("localhost", 7018).identify();
        console.info("Result jetty 9.4: " + result);
        assert(result.serverType == "jetty");

        var result = await new ServerVersionIdentifier("localhost", 7019).identify();
        console.info("Result jetty 10: " + result);
        assert(result.serverType == "jetty");

        var result = await new ServerVersionIdentifier("hackyourselffirst.troyhunt.com", 443, true).identify();
        console.info("Result hackyourselffirst.troyhunt.com " + result);
        //assert(result.serverType == "jetty");
    }
    */

    /*
    async testSSLMethod() {

        // hackyourselffirst.troyhunt.com
        var result = await new SSLProcolChecker("hackyourselffirst.troyhunt.com", 443).run();
        new PrettyPrint().run(result);

        // hacking-lab.com
        var result = await new SSLProcolChecker("hacking-lab.com", 443).run();
        console.info("hacking-lab.com: " + result);

        // pentesteracademylab.appspot.com
        var result = await new SSLProcolChecker("pentesteracademylab.appspot.com", 443).run();
        console.info("pentesteracademylab.appspot.com: " + result);

        // google.fr
        var result = await new SSLProcolChecker("google.fr", 443).run();
        console.info("google.fr: " + result);
    }
    */

    /*
    async testSSLProtocol() {
        var result = await new SSLProcolChecker("localhost", 443).run();
        new PrettyPrint().run(result);
    }
    */

    /*
    async testCipher() {
        return new CipherChecker("google.fr", 443).run();
    }
    */
}