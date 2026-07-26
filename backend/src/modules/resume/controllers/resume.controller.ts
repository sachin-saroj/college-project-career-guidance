import { Request, Response, NextFunction } from 'express';
import { resumeService } from '../services/resume.service';
import { atsService } from '../services/ats.service';
import { pdfService } from '../services/pdf.service';
import { aiResumeAssistantService } from '../services/aiResume.service';
import { AppError } from '../../../utils/AppError';

export const createResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.createResume(req.user!.userId, req.body);
    res.status(201).json({ status: 'success', data: resume });
  } catch (error) { next(error); }
};

export const getResumes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resumes = await resumeService.getResumesByUser(req.user!.userId);
    res.status(200).json({ status: 'success', data: resumes });
  } catch (error) { next(error); }
};

export const getResumeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user!.userId);
    res.status(200).json({ status: 'success', data: resume });
  } catch (error) { next(error); }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.user!.userId, req.body);
    res.status(200).json({ status: 'success', data: resume });
  } catch (error) { next(error); }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user!.userId);
    res.status(204).send();
  } catch (error) { next(error); }
};

export const calculateAtsScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user!.userId);
    const report = await atsService.calculateScore(resume);
    res.status(200).json({ status: 'success', data: report });
  } catch (error) { next(error); }
};

export const exportPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user!.userId);
    const pdfBuffer = await pdfService.generatePdf(resume);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf"`
    });
    
    res.status(200).send(pdfBuffer);
  } catch (error) { next(error); }
};

// --- AI Endpoints ---

export const aiRewriteBullets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bullets } = req.body;
    if (!bullets || !Array.isArray(bullets)) {
      throw new AppError('An array of bullet points is required', 400);
    }
    const rewritten = await aiResumeAssistantService.rewriteBulletPoints(bullets);
    res.status(200).json({ status: 'success', data: rewritten });
  } catch (error) { next(error); }
};

export const aiGenerateSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user!.userId);
    const summary = await aiResumeAssistantService.generateSummary(resume);
    res.status(200).json({ status: 'success', data: summary });
  } catch (error) { next(error); }
};
