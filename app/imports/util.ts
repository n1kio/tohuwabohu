import { Participant } from '/imports/api/events'

const hasParticipantTimeslot = (participants:[Participant], userEmail:string, timeslot:Date):boolean => {
    /**
     * Returns the result of the existance check of a timeslot within a participant's timeslots.
     *
     * @param participants - List of all event participants
     * @param userEmail - The email address of the session user
     * @param timeslot - The date to check for
     * @returns A boolean containing the result of the existance check
     */

    const participant:Participant = participants?.filter((participant) => {
        return participant.email === userEmail
    })[0]
    if(participant) {
        const result = participant.timeslots?.filter((pTimeslot) => {
            return ''+roundTime(pTimeslot) === ''+roundTime(timeslot)
        })
        return result?.length === 1
    }
    return false
}

const roundTime = (datetime:Date):Date => {
    /**
     * Round time to the nearest minute.
     *
     * @param datetime - The datetime to round
     * @returns A rounded datetime
     */
    datetime.setSeconds(datetime.getMinutes() + Math.round(datetime.getSeconds() / 60))
    datetime.setSeconds(0, 0)
    return datetime
}

export { hasParticipantTimeslot, roundTime }
