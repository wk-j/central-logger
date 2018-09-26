#addin "wk.StartProcess"
#addin "wk.ProjectParser"

using PS = StartProcess.Processor;
using ProjectParser;

var npi = EnvironmentVariable("npi");
var name = "CentralLogger";

var currentDir = new DirectoryInfo(".").FullName;
var info = Parser.Parse($"src/{name}/{name}.csproj");

Task("Build-Web").Does(() => {
    CleanDirectory("src/CentralLogger/wwwroot");
    PS.StartProcess("npm install --prefix client");
    PS.StartProcess("npm run build  --prefix client");
});

Task("Pack").Does(() => {
    DotNetCorePack($"src/CentralLogProvider", new DotNetCorePackSettings {
        OutputDirectory = "publish"
    });
});

Task("Publish").Does(() => {
    CleanDirectory("publish");
    DotNetCorePublish($"src/{name}/{name}.csproj", new DotNetCorePublishSettings {
        OutputDirectory = "publish"
    });
});

Task("Publish-NuGet")
    .IsDependentOn("Pack")
    .Does(() => {
        var packages = new DirectoryInfo("publish").GetFiles("*.nupkg");
        foreach (var nupkg in packages)
        {
            var package = nupkg.FullName;
            Console.WriteLine(nupkg.FullName);
            NuGetPush(package, new NuGetPushSettings {
                Source = "https://www.nuget.org/api/v2/package",
                ApiKey = npi
            });
        }
});

var target = Argument("target", "Pack");
RunTarget(target);
