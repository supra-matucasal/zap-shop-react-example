import React, { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'

export interface IIconsProps {
  className?: string
  hover?: boolean | string
  fill?: boolean | string
  stroke?: boolean | string
}

export interface IRankZapProgressProps {
  className?: string
  progress?: number
  maskID?: string
}

export interface OnboardingContext {
  user: any
  events: any
  isOnboarding: () => boolean
  isStakedPool: boolean
  isStaked: boolean
  isOnboarded: boolean
}

export type OnboardingStepCheck = (ctx: OnboardingContext) => boolean

export interface OnboardingStep {
  path: string
  enforceRedirect: boolean
  shouldProceed: OnboardingStepCheck
}

export interface ICarouselSliderProps {
  children?: ReactElement | any
  settings: {
    dots: boolean
    arrows: boolean
    infinite: boolean
    slidesToShow: number
    slidesToScroll: number
  }
  customArrowButton?: boolean
  customButtonClass?: string
  arrowFillColor?: string
  arrowPosition?: string
  sliderMainClass?: string
}

export interface IPixelatedImageProps {
  src?: string
  src10?: string
  alt?: string
  className?: string
  imageContainerClass?: string
  width?: number
  height?: number
  fallbackSrc?: string
}

export interface ISlideImageProps {
  width?: number
  height?: number
  className?: string
  imageContainerClass?: string
  imageClassName?: string
  alt?: string
  src: string
  fill?: boolean
  sizes?: string
  bgColorClass?: string
  styles?: React.CSSProperties
  isInView?: boolean
}

export interface ISplitTitleProps {
  children?: ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p'
  className?: string
  triggerStart?: string
  triggerEnd?: string
  trigger?: string
}

export interface ISEOMetaProps {
  title?: string
  meta_title?: string
  image?: string
  description?: string
  canonical?: string
  noindex?: boolean
  genericImage?: string
}

export interface IRewardProps {
  type: string
  value: number
}

export interface Lesson {
  id: string
  topic: string
  updatedBy: string
  updatedAt: string
  sort: number
  createdBy: string
  createdAt: string
  status: string
  slug: string
  title: string
  lessonProgressStatus: string | boolean
  collection: string
}

export interface InstructorProps {
  id: string
  sort: number | null
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  avatar: string | null
  slug: string
  title: string
  bio: string
  name: string
  instructors_courses: {
    courses_id: string
    instructors_id: string
  }
}

export interface Category {
  id: string
  icon: string
  name: string
  slug: string
  pluralName: string
  createdAt: string | null
  updatedAt: string | null
}

export interface ICourse {
  id: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
  duration: string
  rewards: IRewardProps[]
  createdBy: string
  updatedBy: string
  isFeatured: boolean
  featuredImage: string
  category: string
  description: string
  slug: string
  difficultyLevel: string
  tags: string
  length?: any
  enrolled: boolean
  completed: boolean
  [x: string]: any
  lastLesson: string | null
  topics: any
  instructors: InstructorProps[]
  categories: Category
  enrolledUserCount: number
  isBookmarked: boolean
}

export interface IButtonProps {
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  className?: string
  children?: ReactElement | any
  disabled?: boolean
  onClick?: () => void
  linkclass?: string
  target?: string
  ariaLabel?: string
  link?: string
  prefetch?: boolean
}

export interface IClassName {
  className?: string
}

export interface ICourseCardProps {
  featured?: boolean
  className?: string
  data: ICourse
  imageClassName?: string
  titleClassName?: string
  totalCompletedCourse?: string | ReactElement
  enrolledUserCount?: number
  showRewards?: boolean
  showScore?: boolean
  isBookmarked?: boolean
  isFeaturedCourseTag?: boolean
  showTotalCompletedCount?: boolean
  handleBookmark?: any
}

export interface ICourseStatsProps {
  className?: string
  featured?: Boolean
  showScore?: Boolean
  showRewards?: Boolean
  data: ICourse
}

export interface IKnowProps {
  title: string
  className?: string
  content: string | ReactElement
}

export interface IInstructorProps {
  title?: string
  instructorThumb: string
  instructorName: string
  instructorDesignation: string
  instructorBio?: ReactNode
  containerClassName?: string
  className?: string
}

export interface ICourseStatsTypes {
  className?: string
  data: {
    difficultyLevel?: string
    categories?: {
      name?: string
      icon?: string
    }
    duration?: string
    rewards?: IRewardProps[]
  }
  params: {
    courseId: any
  }
}

export interface ICourseStatsChildTypes {
  children?: ReactNode
}

export interface IChaptersDetailsProps {
  params: {
    courseId: string | null | number
    lessonId: string | null | number
  }
  searchParams?: {
    quizes?: string
  }
  lessonDetails?: any
  nextLesson?: string
  previousLesson?: string
}
interface IQuizAnswerOption {
  answer: string
  is_correct: boolean
}

export interface IQuizQuestion {
  id: string
  randomize: boolean
  quizId: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  sort: number | null
  createdBy: string
  answerOptions: IQuizAnswerOption[]
  answerRequired: boolean
  answerExplanation: string | null
  question: string
  questionType: 'checkbox' | 'radio' | 'text'
  marks: number
}

export interface IQuizContent {
  id: string
  status: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  title: string
  description: string | null
  passingMarks: number
  quizQuestions: IQuizQuestion[]
}

export interface IAudioContent {
  audioUrl: string
}

export interface IBlockVideoContent {
  videoUrl: string
}

export interface IHtmlContent {
  htmlData: string
}

export interface IQuizData {
  id: string
  lessonsId: string
  item: string
  collection: 'audio_content' | 'block_video' | 'block_html' | 'quizes'
  content: IQuizContent | IAudioContent | IBlockVideoContent | IHtmlContent
}

export interface IquizesDataProps {
  id: string
  video_url: string
  raw_html: string
  title: string
  headline: ReactElement
  lessonsId?: string
  collection: string
  coursesId?: string
  topicsId?: string
  content?: {
    id: string
    description?: any
    passingMarks?: number
    title: string
    totalCadetPerfectScore: number
    quizQuestions: Array<{
      id: string
      question: string
      question_type: string
      answer_required: boolean
      answer_explanation: any
      answer_options: Array<{
        answer: string
        is_correct: boolean
      }>
      rewards?: {
        type: string
        value: number
      }[]
    }>
    participants?: number
    totalUserPass?: number
    quizResult: IQuizResultProps
  }
}

export interface IQuizResultProps {
  passingMarks?: number
  totalMarks?: number
  userMarks?: number
  percentage?: number
  stars?: number
  zaps?: number
  result?: string
  createdAt?: string | Date
  quizScore?: {
    questionAnswers?: {
      questionId: string | null
      answer: any[]
    }[]
  }
  questionAnswers?: {
    questionId: string | null
    answer: any[]
  }[]
}

export interface IBlockVideosProps {
  data: {
    id: string
    videoUrl: string
    title: string
    headline: ReactElement
  }
}

export interface IQuizDetailsProps {
  quizesData: IquizesDataProps | undefined
  params?: IParamsProps
  nextLesson?: string
  previousLesson?: string
  getCoursesListData?: ICourse
  formattedAnswers?: any
  handleSubmitLesson?: (val: boolean) => void
  handleSubmitQuiz?: any
  fetchCourseProgress?: any
}

export interface IQuestionProps {
  quizesData: IquizesDataProps | undefined
  params: {
    courseId?: string | number | undefined
    lessonId?: string | number | undefined
  }
  nextLesson?: string
  setShowQuizResult: (val: boolean) => void
  handleSubmitQuiz?: any
  fetchCourseProgress?: any
}

export interface IQuizOverviewProps {
  params?: {
    courseId?: string | number | undefined
    lessonId?: string | number | undefined
  }
  nextLesson?: {
    slug?: string | undefined
    courseId?: string | undefined
  }
  previousLesson?: {
    slug?: string | undefined
    courseId?: string | undefined
  }
  ref?: any
  quizesData?: IquizesDataProps | undefined
  setStartQuiz?: (val: boolean) => void
  setShowCourseResult?: (val: boolean) => void
  handleSubmitLesson?: any
  getCoursesListData?: any
}

export interface IParamsProps {
  courseId?: string
  params: {
    slug?: string
    courseId?: string
    lessonId?: string
  }
}

export interface IMetaProps {
  map(arg0: (tagItem: IMetaProps, index: number) => React.ReactElement): unknown
  name: string
}

export interface ICopyButtonProps {
  textToCopy: string
  children?: ReactElement
  icon?: ReactElement
  copyWithToolTip?: boolean
  className?: string
}

export interface ICoursesListingProps {
  courseData: any[]
  className?: string
}

export interface ICommonIconsProps {
  className?: string
  fill?: string
}

export interface IUserinfo {
  className?: string
  userName?: string
}

export interface IFilterTagsProps {
  tagsData: IMetaProps
  searchParams: {
    tags?: string | string[] | ICoursesProps
  }
}

export interface ISearchCourseProps {
  searchParams: {
    q: string | undefined
  }
}

export interface ILessonsListing {
  lessons: any
  openIndex?: number
  className?: string
  titleClass?: string
  contentClass?: string
  secondaryAction?: boolean
}

export interface ITopic {
  id: string
  topics_id?: {
    name: string
    lessons?: Lesson[]
  }
}

export interface ILessonProps {
  slug: string
  [key: string]: string
}

export interface IListProps {
  title: string
  className?: string
  icon?: ReactElement
  isActive?: boolean
  isCompleted?: boolean
}

export interface IcourseDetailsProps {
  children: React.ReactNode
  progressBar: React.ReactNode
  lessons: React.ReactNode
}

export interface IInputFieldProps {
  name?: string
  value?: string | number
  inputClassName?: string
  wrapperClassName?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  startAdornment?: string | ReactElement
  endAdornment?: string | ReactElement | null
  showError?: boolean
  errorMessage?: string
  className?: string | ReactElement | null
  defaultValue?: string | number | readonly string[]
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  field?: any
}

export interface IPaginationProps {
  className?: string
  data?: any
  page?: number | undefined | null
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClickNext?: any
  onClickPrev?: any
  disabledNext?: boolean
  disabledPrev?: boolean
  numberInputRef?: any
  defaultPageNumber?: number
  pageCount?: number | string
  searchParams: {
    page?: string
  }
}

export interface ICourseProgressBarProps {
  title?: string
  className?: string
  barHeight?: string
  data?: any
}

export interface IProgressProps {
  title: string
  className?: string
  totalCourse: number
  completeCourse: number
  barHeight?: string
}

export interface IBadgesProps {
  children: React.ReactNode
  className?: string
}

export interface ICourseSearchParams {
  page?: string
  q?: string
  category?: string
  categories?: string
  tags?: string | string[]
  sort?: string
}

export interface ICourseDetailProps {
  params: {
    slug?: string
    courseId?: string | number
    lessonId?: string | number
  }
  lessonDetail: any
  topicDetails: any
  searchParams?: {
    quizes?: string
  }
  previousLesson?: string
  nextLesson?: string
}

export interface ICategoryNavProps {
  className: string
  searchParams: any
  coursesCategory: {
    id?: string
    name?: string
    slug?: string
  }
}

export interface IFilterCoursesProps {
  coursesCategory: ICourseCategory
  searchParams: {
    category: string
    tags: string
    direction: any
    sort: any
  }
  coursesTags?: IMetaProps
}

export interface IOptionsProps {
  page?: number
  limit?: number
  filter?: any
  offset?: number
}

export interface IAccordionProps {
  title?: string
  className?: string
  titleClass?: string
  contentClass?: string
  open?: boolean
  expandedSlug?: number
  onOpen?: Dispatch<SetStateAction<number | undefined>>
  activeSlug?: number
  children: ReactElement
  arrowIcon?: ReactElement
}

export interface SRTLine {
  index: number
  startTime: number
  endTime: number
  text: string
}

export interface CapsuleWrapperProps {
  className?: string
  children?: ReactNode
}

export interface ICourseCategory {
  id?: string
  name?: string
  plural_name?: string
  slug?: string
  icon?: string
}

interface ILessonItemProps {
  id?: string
  video_url?: string
  title?: string
  headline?: ReactNode
}

export interface ILessonDataProps {
  id?: string
  collection?: string
  item: ILessonItemProps
}

export interface LessonItemProps {
  lesson: Lesson
  isActive: boolean
  courseId: string
}

export interface ITopicLessonsProps {
  lessons: Lesson[]
  activeLesson: string
  courseId: string
}

export interface IMappedTopicProps extends ILessonsList {
  index: number
  isLessonMatching: boolean
}

export interface IResultCardProps {
  cardTitle?: string
  totalNumber?: string | ReactElement
  className?: string
}

export interface IResultStatusProps {
  children: React.ReactNode
  className?: string
  result?: React.ReactNode
}

export interface IVideoCardProps {
  poster: string
  title?: string
  duration?: string
  width: number
  height: number
  className?: string
  imageClassName?: string
  titleClassName?: string
  featured?: boolean
}

export interface IEventDefinitionProps {
  id: string
  name: string
  description: string
  type: string
  createdAt: string
}

export interface IComponentProps {
  children?: ReactNode
}

export interface IBackToLink {
  className?: string
  LabelText?: string
  link?: string
  labelClass?: string
  linkClass?: string
  target?: string
  onClick?: () => void
}

export interface IProvidersProps {
  themeProps?: string
  isBanner?: boolean
  children: React.ReactNode
  userSession: any | null
}

export interface INotification {
  id: string
  description: string
  metadata: any
  imageSrc: string
  type: string
  read: boolean
  seen: boolean
  dismissed: boolean
  readAt: EpochTimeStamp | null
  createdAt: EpochTimeStamp
  updatedAt: EpochTimeStamp
}

export interface IRank {
  id: string
  rankName: string
  rankNumber: number
  goal: number
  reward: number
  entries: number
  imageSrc: string
  position?: DOMRect
  isExpeditionLocked: boolean
}

export enum UserGiveawayStatus {
  PENDING = 'pending',
  READY = 'ready',
  CLAIMED = 'claimed',
  EXPIRED = 'expired',
}

export interface IUserProps {
  id: string | null
  auth0Id: string | null
  refCode: string | null
  referralUrl: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  username: string | null
  phoneNumber: string | null
  country: string | null
  isBanned: boolean
  ref: string | null
  bannedReason: string | null
  kycStatus: string | null
  totalZaps: string | null
  totalPoints: string | null
  totalPointsS1: string | null
  totalTokens: string | null
  isPhoneNotificationsEnabled: boolean
  isGpcEnabled: boolean
  supraTokenPrice: number
  isEmailVerified: boolean
  rankName: string | null
  manualReview: boolean
  createdAt: string | null
  discordId: string | null
  discordAccount: string | null
  twitterId: string | null
  twitterAccount: string | null
  totalReferralsCount: number | null
  emailVerificationCode: string | null
  verificationEmailSentAt: string | null
  walletAddress: string | null
  stakingPreference: string | null
  passportStatus: string | null
  synapsSessionId: string | null
  passportActivated: boolean
  tourCompleted: boolean
  mintPassportResponse: any | null
  profilePicture: string | null
  rankZapsMultiplier: number | null
  currentPollStreak: number | null
  maxPollStreak: number | null
  currentPollStreakUpdatedAt: string | null
  token: string | null
}

export interface IEventProps {
  id: string
  name: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface TextWrapperProps {
  className?: string
  children?: ReactNode
}

export interface ICoursesInstructorProps {
  id: number | string
  avatar?: string
  title: string
  name: string
  bio?: string
}

export interface ILessonsList {
  id: string
  name: string
  sort: number
  lessons: Lesson[]
}

export interface InfiniteScrollProps {
  courseData: any[]
  searchParams: Record<string, string | number | undefined>
  totalPages: number
}

export interface ICoursesProps {
  data?: ICourse
  className?: string
  slidesToShow?: number
  isShowCourseProgress?: boolean
  searchParams?: {
    q?: string
    category?: string
    categories?: string
    tags?: string[] | string
    page?: number
    sort?: {
      direction?: string
      field?: number | string
    }
  }
}

export interface IsearchParamsProps {
  searchParams: Record<string, string | number | undefined>
}



export interface IDocumentProps {
  image: string
  categories: string
  title: string
  description: string
  url: string
}

export interface IDocumentCardProps {
  className?: string
  data: IDocumentProps
}

export interface IVideoProps {
  image: string
  duration: string
  title: string
  description: string
  url: string
}

export interface IVideoResourcesCardProps {
  className?: string
  data: IVideoProps
}

export interface ICadetsRanksProps {
  rankNumber?: string
  rankLabel: string
  imgClass?: string
  className?: string
  titleClass?: string
  rankLabelClass?: string
  title?: string | boolean
  data?: any
  modalClose?: (val: boolean) => void
}
export interface ITokenBlockProps {
  totalZaps?: string
  totalStars?: string | number
  supraTokens?: string
  className?: string
  isZaps?: boolean
}
export interface IAccountNavProps {
  userName: string
  userEmail: string
  className?: string
  userData?: any
  userLogin?: () => void
}

export interface IconProps {
  user: IUserProps | null
  userEvents: IEventProps[] | null
  getIconColor: (step: number) => string
}

export interface IWalletConnectionIconProps extends IconProps {
  isOnboardedFreeUser: boolean
}

export interface IKYCVerificationIconProps extends IWalletConnectionIconProps {
  isUserOnboardedWithKYC: boolean
}

export interface IStakeIconProps extends IconProps {
  isUserOnboardedWithKYC?: boolean
  isUserStakedPool: boolean
}

export interface ISocialItemProps {
  icon: React.ReactElement
  link: string
  ariaLabel?: string
}

export interface ISocialListProps {
  data: ISocialItemProps[]
  className?: string
  linkClassName?: string
}

export interface IFetchAPIProps {
  host?: string
  query: string | any
  variables?: any
  options?: any
  requiresAuth?: boolean
  requiresAuthApiKey?: boolean
  shouldRevalidate?: boolean
  revalidateTime?: number
}

export interface IgetCoursesListProps {
  page?: number
  limit?: number
  searchText?: string
  sort?: {
    direction?: string
    field?: number | string
  }
  categories?: string
  tags?: string
  slug?: string | number | any
  isFeatured?: boolean
  myProgress?: boolean
  requiresAuth?: boolean
}

export interface IgetCourseTopicsProps {
  slug?: string | any
  coursesId?: string
  lessonId?: string
  status?: string
  topicsId?: string | null
  addLessonDetailsProgressInput?: {
    coursesId?: string
    lessonId?: string
    topicsId?: string | null
    status?: string
  }
}

export interface ISubmitQuizProps {
  coursesId?: string
  lessonsId?: string | number | null
  quizesId?: string | number | null
  topicsId?: string | number | null
  missionTaskBlockId?: string | number | null
  questionAnswers?: {
    questionId: string | null
    answer: any[]
  }[]
}

export interface ILearnAndShareProps {
  params?: any
  data: {
    id: string
    enrolled: boolean
    isBookmarked: boolean
    completed: boolean
    isPremium: boolean
    lastLesson: {
      slug: string
    }
    topics: {
      lessons: {
        slug: string
      }[]
    }[]
    totalLessons: number
    totalLessonsDone: number
  }
  bookMarkCheck?: (coursesId: string) => Promise<void>
  recheckCourseIsCompletedAction?: (coursesId: string) => Promise<void>
}

export interface ILessonPaginationsProps {
  params: {
    courseId?: string
    lessonId?: string
  }
  previousLesson?: {
    slug: string | number
  }
  nextLesson?: {
    slug: string | number
  }
  topicDetails: any[]
  lessonDetails: any[]
  courseDetails: ICourse | any
  handleSubmitLesson: any
}

export interface QuizeSubmittedProps {
  params: {
    courseId: string
    lessonId: string
  }
  data?: any
  nextLesson?: any
  setShowCourseResult?: () => void
}

export interface IMission {
  name: string
  subTitle: string
  url?: string
  description?: ReactNode
  missionImage: string
  missionLogo: string
  missionTimeDate: string
  category: string
  reward: IRewardProps
  zap: number | string
  missionThemeColor: string
  isCompleted: boolean
  missionSteps: boolean[]
  completedAt?: string
  completionStats: {
    tasksCompleted?: number
    tasksTotal?: number
    completionPercentage?: number
  }
}

export interface IGetFaqsProps {
  faqSlug?: string
  searchText?: string | any
  categorySlug?: string
}

export interface IFaqsListProps {
  id: string
  answer: string
  question: string
}

export interface ILessonPagnationsProps {
  previousLesson?: {
    id: string
    lessonProgressStatus: string
    topicId: string
    topicname: string
    title: string
    slug: string
  }
  nextLesson?: {
    id: string
    lessonProgressStatus: string
    topicId: string
    topicname: string
    title: string
    slug: string
  }
}

export interface ICourseResultProps {
  params: {
    courseId: string
    lessonId: string
  }
  nextCourse: {
    slug: string
  }
  courseId?: string
}

export interface ICourseProgressProps {
  className?: string
  data?: ICourse[]
}

export interface IRewardsDataProps {
  data: IRewardProps[]
  showStars?: boolean
  showZaps?: boolean
}

export interface IRewardsStatsProps {
  label: string
  className?: string
  result: string
}

export interface IZapsSumProps {
  stars: number
  zaps: number
}

export interface IBookmarCourseProps {
  data: ICourse
  isBookmarked?: boolean
  showTotalCompletedCount: boolean
}

export interface IQuizScoreProps {
  quizTitle: string
  score: number | string
  outOfPoints: number | string
  data: IQuizResultProps | any
}

export interface ICourseProgressProps {
  searchParams: {
    course: string
    modal?: string
  }
}

export interface ICourseListing {
  data: ICourse[]
  showRewards?: boolean
  showScore?: boolean
  isBookmarked?: boolean
  showTotalCompletedCount?: boolean
}

export interface IProgressListingProps {
  data: ICourse
  searchParams: any
}

export interface ICourseLisintgProps {
  data: ICourse
  showRewards?: boolean
  showScore?: boolean
  isBookmarked?: boolean
}

export interface ICourseProgressTabsProps {
  title: string
  value: string
  urlPath: string
}

export interface IAudioPlayerProps {
  data: {
    audioMp3Url: string
    audioSrtUrl: string
  }
  className?: string
  AudioButtonColor?: string
}

export interface ISocialSharingProps {
  id: string | number
  icon: ReactElement
  link: string
  ariaLabel: string
  platform: string
}

export interface ILessonsListProps {
  params: {
    courseId: string
    lessonId: string
  }
  isPremiumLesson: boolean | null
  topicDetails: ILessonsList[]
}

export interface IConnectStarKeyWalletProrps {
  children?: ReactElement
  walletConnectButtonText?: string
  title?: string
  subTitle?: string
  spacingClass?: string
}
declare global {
  interface Window {
    starKeyWallet?: {
      supra?: {
        createRawTransactionData: (args: any[]) => Promise<any>
        sendTransaction: (params: any) => Promise<string>
        connect: (options: { chainId: string; multiple?: boolean }) => Promise<string[]>
        disconnect: () => Promise<void>
        account: () => Promise<string[]>
        getChainId: () => Promise<string>
        balance: (address?: string) => Promise<{ balance: string; formattedBalance: string }>
        on?: (event: string, callback: (...args: any[]) => void) => void
      }
    }
    starkey?: {
      supra?: {
        createRawTransactionData: (args: any[]) => Promise<any>
        sendTransaction: (params: any) => Promise<string>
        connect: (options: { chainId: string; multiple?: boolean }) => Promise<string[]>
        disconnect: () => Promise<void>
        account: () => Promise<string[]>
        getChainId: () => Promise<string>
        balance: (address?: string) => Promise<{ balance: string; formattedBalance: string }>
        on?: (event: string, callback: (...args: any[]) => void) => void
      }
    }
  }
}

export interface IRewardProps {
  type: string
  value: number
}

export interface IAudioContent {
  id: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  title: string
  htmlData: any
  audioSrtUrl: string
  audioMp3Url: string
  description: string | null
}

export interface ISocialLink {
  name: string
  url: string
  icon_url: string
}

export interface IConfiguration {
  social_links: ISocialLink[]
}

export interface IAdvancedContent {
  id: string
  block_type: string
  name: string
  description: string
  configuration: IConfiguration
  webhook_url: string | null
  callback_url: string | null
  external_service_url: string | null
}

export interface IWebhookBlockProps {
  id: string
  //eventDefinitionId: number
  webhookUrl: string
  eventName: string
  completedAt?: string | null
}

export interface ISocialMediaConnectProps {
  id: string
  //eventDefinitionId: number
  url: string
  text: string
  icon?: string | null
  eventName: string
  completedAt: string
  taskBlockId: string
}

export interface ILinkBlockProps {
  id: string
  url: string
  text: string
  eventName: string
  completedAt: string
  taskBlockId: string
}

export interface VidyardPlayerProps {
  className?: any
  videoId?: string | number
  controls?: string | number
  autoplay?: string | number
  aspect?: '4:3' | '16:9' | '16:10'
  height?: string | number
  width?: string | number
}

export interface IRanksProps {
  id: string
  rankNumber: number
  goal: number
  rankName: string
  reward: number
  entries: number
  imageSrc: string
  isExpeditionLocked: boolean
  position: {
    x: number
    y: number
    bottom: number
    top: number
    left: number
    right: number
    height: number
    width: number
  }
}

export interface IRankTier {
  tier: number
  thresholds: number
  isAchieved: boolean
}

export interface IRankData {
  id: string
  eventName: string
  rankName: string
  points: number | null
  tokens: number | null
  minPoints: number
  maxPoints: number
  multiplier: number
  rankTiers: IRankTier[]
  rankImage: string
  createdAt: string
  updatedAt: string
  isAchieved: boolean
  description: ReactElement
}

export interface IRulesList {
  title: string
}

export interface IRulesSectionProps {
  rulesList: string[]
  className?: string
}

export interface IRulesSectionProps {
  rulesList: string[]
  className?: string
}

export interface IPoweredByProps {
  className?: string
  containerClassName?: string
  contentClassName?: string
  children: React.ReactNode
}

export interface IDiceSelectionBoxProps {
  handleRoll: () => void
  handleDiceError: () => void
  handleResult: (item: number) => void
  refetchGamePlay?: () => void
  playsLeft: number
}

export interface IRPSSelectionBoxProps {
  isResultModel: boolean
  refetchGamePlay?: () => void
  playsLeft: number
  closeResultModel: () => void
  resultData?: any
  RPSWinnerType?: any
}

export interface IHandDataProps {
  type: string
  state: string
}

export interface IWinnerTypeProps {
  RPSTie: boolean
  RPSUser: boolean
  RPSDvrf: boolean
}

export interface IRPSGameResultDataProps {
  winnerType?: IWinnerTypeProps
  setVRFNumber?: number
  selectedNumber?: number
  points?: number
  redHandData?: IHandDataProps
  dogHandData?: IHandDataProps
}

export interface IBlueBoardProps {
  children: React.ReactNode
  parentClassName?: string
  childClassName?: string
  className?: string
}

export interface ICheckWalletSectionProps {
  setConnectModal?: boolean
  openConnectModal?: () => void
  closeConnectModal?: () => void
  extensionInstalled?: boolean
  handleConnectModal?: () => void
  setFaucetModal?: boolean
  closeFaucetModal?: () => void
  faucetStatus?: any
  setFaucetDataModal?: boolean
  closeFaucetDataModal?: () => void
  getFaucetToken?: () => void
  timeCalculator?: (str: string) => string | null
  setLoader?: boolean
}

export interface IDiceProps {
  value: number
  onClick?: (value: number) => void
  isGameLocked?: boolean
  playsLeft?: number
  className?: string
}

export interface IBlueBoardProps {
  children: React.ReactNode
  parentClassName?: string
  childClassName?: string
  className?: string
}
export interface IRandomPagesInfoProps {
  className?: string
}

export interface IErrorModalProps {
  errorModal: boolean
  setErrorModal: (val: boolean) => void
}

export interface ITextLinkProps
  extends React.ClassAttributes<HTMLAnchorElement>,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  withUnderlineAnimation?: boolean
  useNextLink?: boolean
}

export interface ITitleWithAnchorProps {
  title: string
  id?: string
  className?: string
}

export interface IPayloadTypeProps {
  userEmail: string
  reason: string
  otherReason?: string
}

export interface IFormDataProps {
  reason: DeleteAccountReason
  otherReason: string
  email: string
}

export enum DeleteAccountReason {
  PRIVACY_CONCERNS = 'privacy_concerns',
  TOO_MANY_EMAILS = 'too_many_emails',
  ACCOUNT_SECURITY = 'account_security',
  USER_EXPERIENCE = 'user_experience',
  UNSATISFACTORY_CUSTOMER_SUPPORT = 'unsatisfactory_customer_support',
  OTHER = 'other',
}

export interface ITextAreaFieldProps {
  name?: string
  value?: string
  inputClassName?: string
  wrapperClassName?: string
  placeholder?: string
  disabled?: boolean
  startAdornment?: string | ReactElement
  endAdornment?: string | ReactElement
  showError?: boolean
  errorMessage?: string
  type?: string
}

export interface IReviewSubmitModalProps {
  isSubmitReviewOpen: boolean
  overlayReviewModal: () => void
}
export interface ICardItemProps {
  image: string
  title: string
  content: string
  link: string
}

export interface IBlogCardProps {
  data: ICardItemProps
  className?: string
  imgClassName?: string
  imageContainerClass?: string
  titleClassName?: string
  contentClassName?: string
}

export interface IEmailSectionWrapperProsp {
  title: string
  children?: React.ReactNode
  description?: boolean | string
  isShowBackButton?: boolean
  imgName?: boolean | string
}

export type ITFormErrors = {
  containerClass?: string
}

export interface IMission {
  id: string
  eventName: string
  title: string
  subtitle: string
  question: string
  answers: string[]
  status: string
  correctAnswer: string
  answerIndex: number
  imageSrc: string
  sequence: number
  activeFrom: string
  activeUntil: string
  createdAt: string
  updatedAt: string
}
export interface IReferral {
  id: string
  description: string
}
export interface ISocialSharingItem {
  icon: ReactElement
  type: string
  baseUrl: string
  queryParams: Array<{
    url: string
    text: string
    hashtags: string
    subject: string
    u: string
    hashtag: string
    BODY: string
  }>
}

export interface ISortingOptinsProps {
  label: string
  value: string
}
export interface ILinkNavigationProps {
  name: string
  link: string
  isExternal?: boolean
  requiresAuth?: boolean
}

export interface IDeleteAccountProps {
  value: string
  valueLabel: string
  name: string
}
export interface IMannualReviewProps {
  title: string
  description?: string
  imageUrl: string
}
export interface IInstructionProps {
  id: number
  imgWidth: number
  imgHeight: number
  title?: string
  imageUrl: string
}

export interface ICheckWalletSectionProps {
  setConnectModal?: boolean
  closeConnectModal?: () => void
  extensionInstalled?: boolean
  handleConnect?: () => void
  handleConnectModal?: () => void
  setFaucetModal?: boolean
  closeFaucetModal?: () => void
  faucetStatus?: any
  setFaucetDataModal?: boolean
  closeFaucetDataModal?: () => void
  getFaucetToken?: () => void
  timeCalculator?: (str: string) => string | null
  setLoader?: boolean
}

export interface IDefaultProfilePictureProps {
  isSelected: string
  isOnboarding?: boolean
  handleSelectPicture: (picture: string) => void
}
export interface ISocialShareProps {
  type: string
  baseUrl: string
  queryParams: {
    text: string
    hashtags: string
  }
}
export interface IMessageProps {
  text: string
  isSent: boolean
  avatarUrl: string
  readAt: any
}

export type TInfoBox = {
  text: string
  imageComponent: ReactElement
  title?: string
  className?: string
}

export interface ItoggleModal {
  toggleModal: (
    modalKey:
      | 'isConnected'
      | 'isStarkeyInstalled'
      | 'isLoading'
      | 'isConnectModal'
      | 'isFaucetDataModal'
      | 'isFaucetModal'
      | 'isErrorModal',
    value: boolean,
  ) => void
}

export interface IWalletContextType {
  isConnected: boolean
  isStarkeyInstalled: boolean
  account: string | null
  balance: string | null
  chainId: string | null
  isLoading: boolean
  isConnectModal: boolean
  isFaucetDataModal: boolean
  isFaucetModal: boolean
  isErrorModal: boolean
  isError: { show: boolean; message: string; description: any }
  faucetStatus: any
  connectWallet: (options: { chainId: string }) => Promise<void>
  disconnectWallet: () => void
  closeFaucetModal: () => void
  openFaucetModal: () => void
  closeConnectModal: () => void
  openConnectModal: () => void
  handleConnectModal: () => void
  handleDisconnect: () => void
  handleError: (show: boolean, message: string, description: string) => void
  closeFaucetDataModal: () => void
  getTokens: () => void
  erorrModal: () => void
  getFaucetToken: () => void
  timeCalculator: (val: string) => void
  switchNetwork: (chainId: string) => Promise<void>
  updateBalance: (address: string) => Promise<void>
  signMessage: (message: string) => Promise<{ [key: string]: string }>
  toggleStarkeyModal: (modalKey: Extract<keyof ItoggleModal | any, boolean>, value: boolean) => void
}

export type EnvironmentProps = 'development' | 'staging' | 'production'

export interface ChainConfig {
  CHAIN_ID: string
}

export interface RpcConfig {
  RPC_URL?: string
}

export interface IContractConfigProps {
  CONTRACT_ADDRESS?: string
  DICE_CONTRACT_ADDRESS?: string
  ROCK_PAPER_CONTRACT_ADDRESS?: string
  PAYMENT_CONTRACT_ADDRESS?: string
  CHAIN_ID?: string
}

export interface ITitleContentProps {
  title?: string
  content?: string
  titleClass?: string
  contentClass?: string
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p'
}

export interface IReadMoreProps {
  children: React.ReactNode
  initialHeight?: number
  moreButtonText?: string
  lessButtonText?: string
  buttonClass?: string
}

export interface IBadgeProps {
  children: React.ReactNode
  currentStep: number
  onPrevStep: () => void
  onNextStep: () => void
}

export type ArrowPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export interface ITooltipProps {
  isOpen?: boolean
  placement?: ArrowPlacement
  title: string | ReactNode
  wrapperClass?: string
  className?: string
  arrowClass?: string
  delay?: {
    open?: number
    close?: number
  }
  children?: string | ReactNode
}

export interface IRedirectLinkProps {
  name: string
  link: string
  isActive: boolean
  isUserBanned: boolean
}

export interface PollOption {
  id: string
  option: string
  answered: boolean
  count: number
  percentage: number
}

export interface PollData {
  id: string
  title: string
  userAnswered: boolean
  rewards?: IRewardProps[]
  pollOptions: PollOption[]
}

export interface DailyPollProps {
  data: PollData
}

export interface PollResultProps {
  data: PollData
  navigationText?: string
  onNavigationClick?: () => void
  isYesterdayPoll?: boolean
}

export interface IHelpItem {
  id: string
  title: string
  slug: string
  description: string | null
  faqs: {
    id: string
    question: string
    description: string
    faqCategoryName: string
    answer: string
    slug?: string
  }[]
}

export interface IHelpContentProps {
  selectedItem: IHelpItem | null
  filteredItems: IHelpItem[]
  selectedCategory: string | null
  onItemSelect: (itemSlug: string) => void
}

export interface IFaqListsProps {
  id: string
  question: string
  answer: ReactElement
}

export interface IFaqsSidebar {
  currentItem: string
  category: {
    id: string
    title: string
    slug: string
    items: { id: string; title: string; slug: string }[]
  }
  handleItemSelect: (slug: string) => void
}

export interface IHubSpotFormProps {
  scriptSrc: string
  region: string
  portalId: string
  hubspotFormId: string
  className?: string
  onFormSubmitted?: any
}
