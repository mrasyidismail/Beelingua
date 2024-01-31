"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beelingua = void 0;
const axios_1 = __importDefault(require("axios"));
class Beelingua {
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
    constructor(authorization, roId, classId, unitId, contentId) {
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
    getStudent(authorization, roId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get('https://apim-bl-prod.azure-api.net/bm7-profile-fe/Person/ProficiencyTest/Detail', { headers: { Authorization: authorization || this.authorization, roid: roId || this.roId } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status)); });
        });
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
    getCourses(authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get('https://apim-bl-prod.azure-api.net/course-fe/Course/List/Student', { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status)); });
        });
    }
    /**
     * Get a specific course
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @returns {Promise<Session>} Course Data
     */
    getCourse(authorization, classId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://apim-bl-prod.azure-api.net/course-fe/ClassSession/Class/${classId || this.classId}/List/Student`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId.' : err.response.status)); });
        });
    }
    /**
     * Get a list of units
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @returns {Promise<Units[]>} Unit List
     */
    getUnits(authorization, classId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getCourse(authorization || this.authorization, classId || this.classId)).unitGroups.flatMap(e => e.units);
        });
    }
    /**
     * Get a specific unit
     * @param authorization Your Authorization Bearer Token
     * @param unitId Unit ID
     * @returns {Promise<Unit>} Unit Data
     */
    getUnit(authorization, unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://apim-bl-prod.azure-api.net/course-fe/ClassSession/${unitId || this.unitId}`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId.' : err.response.status)); });
        });
    }
    /**
     * Get a list of progresses in a unit
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @param unitId Unit ID
     * @returns {Promise<Progresses>} Progress List (Assesment)
     */
    getProgresses(authorization, classId, unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://apim-bl-prod.azure-api.net/course-fe/Class/${classId || this.classId}/ClassSession/${unitId || this.unitId}/ContentProgress`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId or unitId' : err.response.status)); });
        });
    }
    /**
     * Get a specific progress of an assesment
     * @param authorization Your Authorization Bearer Token
     * @param classId Class ID
     * @param contentId Content ID
     * @returns {Promise<Progress>} Assesment Data
     */
    getProgress(authorization, classId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`https://apim-bl-prod.azure-api.net/assessment-fe/Assessment/Class/${classId || this.classId}/ClassSessionContent/${contentId || this.contentId}/Student/OpeningPage`, { headers: { Authorization: authorization || this.authorization } }).then(res => { return res.data; }).catch(err => { throw new Error('An error has occured: ' + (err.response.status === 500 ? 'Invalid Bearer Token' : err.response.status === 404 || 400 ? 'Resource not found, please check your classId or contentId.' : err.response.status)); });
        });
    }
}
exports.Beelingua = Beelingua;
