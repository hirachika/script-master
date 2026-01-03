// MyMemory Translation API Response Types
export interface TranslationMatch {
	id: string;
	segment: string;
	translation: string;
	source: string;
	target: string;
	quality: string;
	reference: string | null;
	'usage-count': number;
	subject: string;
	'created-by': string;
	'last-updated-by': string;
	'create-date': string;
	'last-update-date': string;
	match: number;
}

export interface TranslationResponseData {
	translatedText: string;
	match: number;
}

export interface TranslationApiResponse {
	responseData: TranslationResponseData;
	quotaFinished: boolean;
	mtLangSupported: string | null;
	responseDetails: string;
	responseStatus: number;
	responderId: string;
	exception_code: string | null;
	matches: TranslationMatch[];
}

// Dictionary API Response Types
export interface PhoneticInfo {
	text?: string;
	audio?: string;
}

export interface Definition {
	definition: string;
	example?: string;
	synonyms?: string[];
	antonyms?: string[];
}

export interface Meaning {
	partOfSpeech: string;
	definitions: Definition[];
	synonyms?: string[];
	antonyms?: string[];
}

export interface DictionaryEntry {
	word: string;
	phonetic?: string;
	phonetics: PhoneticInfo[];
	origin?: string;
	meanings: Meaning[];
}

export type DictionaryApiResponse = DictionaryEntry[];

// API Error Types
export interface ApiErrorDetails {
	message: string;
	code?: string;
	statusCode?: number;
	retryable: boolean;
}

export class ApiError extends Error {
	code?: string;
	statusCode?: number;
	retryable: boolean;

	constructor(details: ApiErrorDetails) {
		super(details.message);
		this.name = 'ApiError';
		this.code = details.code;
		this.statusCode = details.statusCode;
		this.retryable = details.retryable;
	}
}
