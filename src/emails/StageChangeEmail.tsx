import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface StageChangeEmailProps {
  candidateName: string
  jobTitle: string
  newStage: string
}

export const StageChangeEmail = ({
  candidateName = 'Candidate',
  jobTitle = 'Position',
  newStage = 'interview',
}: StageChangeEmailProps) => {
  let message = ''
  let heading = ''

  if (newStage === 'screening') {
    heading = 'Your application is in review!'
    message = `We are currently reviewing your profile for the ${jobTitle} position. We'll be in touch soon with next steps.`
  } else if (newStage === 'interview') {
    heading = 'Invitation to Interview'
    message = `Congratulations! We'd like to invite you to an interview for the ${jobTitle} role. Our team will reach out shortly to schedule.`
  } else if (newStage === 'hired') {
    heading = 'Welcome to the Team!'
    message = `We are thrilled to offer you the ${jobTitle} position. You'll receive your 30-day onboarding plan and equipment details shortly.`
  }

  return (
    <Html>
      <Head />
      <Preview>Update on your application for {jobTitle}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans my-auto mx-auto px-2">
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              {heading}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {candidateName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {message}
            </Text>
            <Text className="text-gray-500 text-[12px] leading-[24px] mt-[30px]">
              TalentAI Recruitment Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default StageChangeEmail
