#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import tar from 'tar';
import { execSync } from 'child_process';

program
  .name('sme-skills')
  .description('Install agent skills from GitHub repositories')
  .version('1.0.0');

program
  .command('add')
  .description('Add a skill repository or a specific skill')
  .argument('<repository>', 'GitHub repository in format owner/repo')
  .option('-s, --skill <string>', 'Specific skill folder to extract')
  .action(async (repository, options) => {
    try {
      const parts = repository.split('/');
      if (parts.length !== 2) {
        throw new Error('Repository must be in the format owner/repo');
      }
      
      const { skill } = options;
      console.log(`Fetching repository ${repository}...`);
      
      const url = `https://api.github.com/repos/${repository}/tarball`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'sme-skills-cli'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch repository: ${response.statusText}`);
      }
      
      console.log('Downloading and extracting...');
      
      const destDir = path.join(process.cwd(), '.agents', 'skills');
      fs.mkdirSync(destDir, { recursive: true });
      
      const stream = Readable.fromWeb(response.body);
      
      await new Promise((resolve, reject) => {
        let extractedCount = 0;
        const extract = tar.x({
          cwd: destDir,
          strip: 2, // Strip the GitHub root folder and the `skills` folder
          filter: (filePath, entry) => {
            const pathParts = filePath.split('/').filter(Boolean);
            if (pathParts.length < 3) return false;
            if (pathParts[1] !== 'skills') return false; // Ensure it only extracts from the skills/ directory
            
            if (skill) {
              if (pathParts[2] === skill) {
                  extractedCount++;
                  return true;
              }
              return false;
            }
            
            extractedCount++;
            return true;
          }
        });

        // Some streams finish, some close
        extract.on('finish', () => resolve(extractedCount));
        extract.on('close', () => resolve(extractedCount));
        extract.on('error', reject);
        stream.on('error', reject);
        
        stream.pipe(extract);
      }).then((count) => {
        if (count === 0 && skill) {
            console.warn(`\nWarning: No files found for skill '${skill}'. Please check if the skill exists in the repository.`);
        } else {
            console.log(`\nSuccessfully installed ${skill ? "skill '" + skill + "'" : 'skills from repository'} into ${destDir}`);
            
            // Clone the shared documentation standard into the related skills
            const cloneUrl = 'https://github.com/hoangcongst/ai-friendly-documentation-standard.git';
            const relatedSkills = ['backend-developer', 'business-analyst', 'project-manager', 'qa-qc-engineer'];
            const targetDirs = skill ? [skill] : fs.readdirSync(destDir).filter(f => fs.statSync(path.join(destDir, f)).isDirectory());
            
            for (const dir of targetDirs) {
                if (!relatedSkills.includes(dir)) continue;
                
                const skillDir = path.join(destDir, dir);
                const docDir = path.join(skillDir, 'ai-friendly-documentation-standard');
                if (fs.existsSync(skillDir) && !fs.existsSync(docDir)) {
                   console.log(` -> Attaching standard documentation to ${dir}...`);
                   try {
                       execSync(`git clone ${cloneUrl} ai-friendly-documentation-standard`, { cwd: skillDir, stdio: 'ignore' });
                   } catch(e) {
                       console.warn(`    Failed to clone standard into ${dir}`);
                   }
                }
            }
        }
      });
      
    } catch (err) {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    }
  });

program.parse();
