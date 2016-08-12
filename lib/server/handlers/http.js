module.exports = (app, context, methods) => {
  app.use(function *() {
    const { url } = this.request;
    const splited = url.split('/');

    let requestedMethod = this.request.method;
    let requestedPackage = null;
    let requestedVersion = null;
    let requestedFunction = null;

    if (context.routeAliases[url]) {
      [
        requestedMethod,
        requestedPackage,
        requestedVersion,
        requestedFunction
      ] = context.routeAliases[url];

    } else if (splited[1] == 'f') {
      // genius routing :)
      [,,
        requestedPackage,
        requestedVersion,
        requestedFunction
      ] = splited;
    } else {
      // not found
      return ;
    }

    const contextPackageVersions = context[requestedPackage];
    if (!contextPackageVersions) {
      this.body = `"${requestedPackage}" is not available`;
      return;
    }

    const contextPackage = contextPackageVersions[requestedVersion];
    if (!contextPackage) {
      this.body = `"${requestedPackage}@${requestedVersion}" for  is not available`;
      return;
    }

    const contextPackageFunctions= contextPackage.methods;
    if (contextPackageFunctions.indexOf(requestedFunction) == -1) {
      this.body = `"${requestedFunction}" is not avaiable for "${requestedPackage}@${requestedVersion}"`;
      return;
    }

    const contextPackgeRoutes = contextPackage.routes;
    let isAllowed = true;

    for (const method of Object.keys(contextPackgeRoutes)) {
      if (contextPackgeRoutes[method].indexOf(requestedFunction) != -1) {
        isAllowed = requestedMethod == method;
        break;
      }
    }

    if (isAllowed) {
      // pass props here that depends on http method (query params or body)
      this.body = methods[requestedFunction]();
    } else {
      this.body = 'method is not allowed';
    }
  });
}
