class GreetingRequest {
    constructor(timeOfDay, language, tone) {
        this.timeOfDay = timeOfDay;
        this.language = language;
        this.tone = tone;
    }

    isValid() {
        return (
            typeof this.timeOfDay === 'string' &&
            typeof this.language === 'string' &&
            typeof this.tone === 'string'
        );
    }
}

module.exports = GreetingRequest;
