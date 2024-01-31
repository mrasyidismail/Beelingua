import axios from 'axios';

class Beelingua {
    private authorization: string;
    private roId: string;
    private classId?: string;
    private unitId?: string;
    private contentId?: string;
    /**
     * Create a new Beelingua instance
     * @param authorization Your Authorization Bearer Token
     * @param roId Your RO ID
     * @param classId Class ID
     * @param unitId Unit ID
     * @param contentId Content ID
     * @example <caption>To get specific parameters</caption>
     * ../class/{classId}/session/{unitId}/content/{contentId}/
     */
    constructor(authorization: string, roId: string, classId?: string, unitId?: string, contentId?: string) {
        this.authorization = authorization;
        this.roId = roId;
        this.classId = classId;
        this.unitId = unitId;
        this.contentId = contentId;
    }
    /**
     *
     * @param authorization Your Authorization Bearer Token
     * @param roId Your RO ID
     * @returns {Promise<Student>} Student Data
     */
    public async getStudent(authorization?: string, roId?: string): Promise<Student> {
        return await axios.get('https://apim-bl-prod.azure-api.net/bm7-profile-fe/Person/ProficiencyTest/Detail', { headers: { Authorization: authorization || this.authorization, roid: roId || this.roId } }).then(res => { return res.data }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status)) });
    }
    /**
     * Get a list of courses
     * @param authorization Your Authorization Bearer Token
     * @example <caption>Example usage of getCourses</caption>
     * ```typescript
     * await getCourses('Bearer myToken');
     * ```
     * @returns {Promise<Course[]>} Course List
     */
    public async getCourses(authorization?: string): Promise<Course[]> {
        return await axios.get('https://apim-bl-prod.azure-api.net/course-fe/Course/List/Student', { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status)) });
    }
    /**
     * Get a specific course
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @returns {Promise<Session>} Course Data
     */
    public async getCourse(authorization?: string, classId?: string): Promise<Session> {
        return await axios.get(`https://apim-bl-prod.azure-api.net/course-fe/ClassSession/Class/${classId || this.classId}/List/Student`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId.' : err.response.status)) });
    }
    /**
     * Get a list of units
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @returns {Promise<Units[]>} Unit List
     */
    public async getUnits(authorization?: string, classId?: string): Promise<Units[]> {
        return (await this.getCourse(authorization || this.authorization, classId || this.classId)).unitGroups.flatMap(e => e.units);
    }
    /**
     * Get a specific unit
     * @param authorization Your Authorization Bearer Token
     * @param unitId Unit ID
     * @returns {Promise<Unit>} Unit Data
     */
    public async getUnit(authorization?: string, unitId?: string): Promise<Unit> {
        return await axios.get(`https://apim-bl-prod.azure-api.net/course-fe/ClassSession/${unitId || this.unitId}`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId.' : err.response.status)) });
    }
    /**
     * Get a list of progresses in a unit
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @param unitId Unit ID
     * @returns {Promise<Progresses>} Progress List (Assesment)
     */
    public async getProgresses(authorization?: string, classId?: string, unitId?: string): Promise<Progresses> {
        return await axios.get(`https://apim-bl-prod.azure-api.net/course-fe/Class/${classId || this.classId}/ClassSession/${unitId || this.unitId}/ContentProgress`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId or unitId' : err.response.status)) });
    }
    /**
     * Get a specific progress of an assesment
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @param contentId Content ID
     * @returns {Promise<Progress>} Assesment Data
     */
    public async getProgress(authorization?: string, classId?: string, contentId?: string): Promise<Progress> {
        return await axios.get(`https://apim-bl-prod.azure-api.net/assessment-fe/Assessment/Class/${classId || this.classId}/ClassSessionContent/${contentId || this.contentId}/Student/OpeningPage`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId or contentId.' : err.response.status)) });
    }
}

interface Student {
    name: string;
    proficiencyScores: ProficiencyScore[];
    academicProgram: string;
    admissionYear: number;
    admissionTerm: string;
    courseBalance: number;
    hasAgreedTnC: boolean;
}

interface ProficiencyScore {
    score: number;
    convertedScore: number;
    scoreType: string;
}

interface Course {
    courseId: string;
    classId: string;
    courseCode: string;
    courseTitleEn: string;
    overallProgress: number;
    unitCompleted: number;
    unitTotal: number;
    checkpointCompleted: number;
    checkpointTotal: number;
    courseMasteryCompleted: number;
    courseMasteryTotal: number;
    children: Child[] | null;
    status: string;
}

interface Child {
    courseId: string;
    classId: string;
    isCompleted: boolean;
}

interface Session {
    courseId: string;
    classId: string;
    courseCode: string;
    courseTitleEn: string;
    languageId: string;
    language: string;
    languageCode: string;
    unitCompleted: number;
    unitTotal: number;
    checkpointCompleted: number;
    checkpointTotal: number;
    courseMasteryCompleted: number;
    courseMasteryTotal: number;
    unitGroups: UnitGroup[];
}

interface UnitGroup {
    unitGroup: string;
    unitGroupStatus: string;
    unitGroupCompleted: number;
    unitGroupTotal: number;
    units: Units[];
}

interface Units {
    unitId: string;
    unitNumber: number;
    unitCode: string;
    overallProgress: number;
    status: Status;
    completedDate: Date;
    unitType: UnitType;
    hasUnitReview: boolean;
    unitReviewScore: number;
}

type Status = "done" | "notStarted" | 'locked';

type UnitType = "Unit" | "CheckPoint" | "CourseMastery";

interface Unit {
    id: string;
    classId: string;
    courseTopicId: string;
    topicName: string;
    classTopicId: null;
    classSessionNumber: number;
    dateStartUtc: Date;
    dateEndUtc: Date;
    instructors: Instructor[];
    courseId: string;
    crseId: string;
    courseCode: string;
    courseTitleEn: string;
    courseTitleId: string;
    classCode: string;
    revision: number;
    courseOfferNumber: number;
    sessionCode: string;
    sessionDescription: string;
    courseOutlineTopicID: string;
    sessionNumber: number;
    isDeleted: boolean;
    sessionType: string;
    sessionGroup: string;
    isRevised: boolean;
}

interface Instructor {
    id: string;
    name: string;
    code: string;
    userCode: string;
    pictureUrl: string;
    subRoleTypeId: null;
    subRoleTypeDescription: null;
    role: null;
    personCode: string;
    isEnrolled: boolean;
    isVirtualClass: boolean;
    periodId: null;
    periodFrom: Date;
    periodTo: Date;
}

interface Progresses {
    overallProgress: number;
    isVocabularyExist: boolean;
    listContent: ListContent[];
}

interface ListContent {
    classSessionContentId: string;
    resourceId: null | string;
    status: number;
    contentSubject: string;
    contentType: string;
    resourceType: string;
    prerequisiteType: null | string;
    prerequisites: any[];
    isLocked: boolean;
}

interface Progress {
    id: string;
    courseCode: string;
    courseTitle: string;
    sessionCode: string;
    sessionDescription: string;
    title: string;
    assessmentType: string;
    assessmentDescription: string;
    numberOfQuestion: number;
    minimumPassed: number;
    maxAttempt: number;
    scoringMethod: string;
    isDraftExist: boolean;
    totalAttempted: number;
    history: History[];
    startDateTimeUtc: Date;
    endDateTimeUtc: Date;
    timeLimitInSecond: number;
    isFirstTime: boolean;
}

interface History {
    versionId: string;
    index: number;
    score: number;
    startDate: Date;
    completionDate: Date;
    duration: number;
}

export { Beelingua };