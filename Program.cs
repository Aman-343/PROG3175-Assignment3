using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
namespace ConsoleApp;

public class Program
{
    private static readonly HttpClient client = new HttpClient();
     
    public static async Task Main(string[] args)
    {
        string mainurl = "http://localhost:8080/";

        // Get available times of day
        HttpResponseMessage getTimeofDay = await client.GetAsync(mainurl + "timesOfDay");
        string timesofday = await getTimeofDay.Content.ReadAsStringAsync();
        Console.WriteLine("Available times of day:");
        Console.WriteLine(timesofday);
        

        // Get supported languages
        HttpResponseMessage getsupportedlanguages = await client.GetAsync(mainurl + "languages");
        string languages = await getsupportedlanguages.Content.ReadAsStringAsync();
        Console.WriteLine("\nSupported languages:");
        Console.WriteLine(languages);
        
        bool vaildEntry = true;
        while(vaildEntry)
        {
            // Get user input for time of day and language
            Console.Write("\nEnter the time of day. Example: " + timesofday + "(Case-Sensetive!) : ");
            string timeofDay = Console.ReadLine();

            Console.Write("Enter the language. Example: " + languages + "(Case-Sensetive!) : ");
            string languageRes = Console.ReadLine();

            Console.Write("Enter the tone. Example: Formal or Casual (Case-Sensetive!) : ");
            string toneres = Console.ReadLine();

        
            // Make request to the Greet API
            var request = new { timeOfDay = timeofDay, language = languageRes, tone = toneres };
            HttpResponseMessage response = await client.PostAsJsonAsync(mainurl + "greet", request);

            if (response.IsSuccessStatusCode)
            {
                var greetingResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine(greetingResponse);
                vaildEntry = false;
            }
            else
            {
                Console.WriteLine("\nInvalid time of day or language. Status Code: " + response.StatusCode);
            }
        }
        
    }

    public class GreetingResponse
    {
        public string? Greeting { get; set; }
    }
}