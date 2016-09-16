//Constants class
class Constants
{
    constructor()
    {
        this.constraints = {video: true, audio: true};
    }

    getConstraints()
    {
        return this.constraints;
    }

    setConstraints(constraintsDict)
    {
        this.constraints = constraintsDict;
    }
}

module.exports = Constants;
