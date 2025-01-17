/**
 * March Networks
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface CreateIntelligentRetrievalEventRequestDto { 
    /**
     * The name for the event
     */
    name: string;
    /**
     * The query for the event
     */
    searchQueryId: string;
    /**
     * The desired threshold similarity score (1 - 100)
     */
    similarityScore: number;
}

